import { useCallback, useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { config } from '../shared/config';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
  }
}

export const useGoogleAuth = () => {
  const { loginWithGoogle } = useAuth();
  const [isGoogleReady, setIsGoogleReady] = useState(false);

  // Check if Google is ready whenever the component re-renders
  useEffect(() => {
    const checkGoogleReady = () => {
      const ready = !!window.google && !!config.GOOGLE_CLIENT_ID;
      setIsGoogleReady(ready);
    };

    checkGoogleReady();

    // Also check periodically in case the script loads later
    const interval = setInterval(checkGoogleReady, 100);

    // Clean up after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const initializeGoogleAuth = useCallback(() => {
    if (!window.google || !config.GOOGLE_CLIENT_ID) {
      console.warn('Google OAuth not configured or Google SDK not loaded');
      return;
    }

    window.google.accounts.id.initialize({
      client_id: config.GOOGLE_CLIENT_ID,
      callback: handleGoogleCallback,
    });
  }, []);

  const handleGoogleCallback = useCallback(async (response: any) => {
    try {
      if (response.credential) {
        await loginWithGoogle(response.credential);
      }
    } catch (error) {
      console.error('Google auth failed:', error);
    }
  }, [loginWithGoogle]);

  const signInWithGoogle = useCallback(() => {
    if (!window.google) {
      console.error('Google SDK not loaded');
      return;
    }

    try {
      // Try to use the prompt method first
      window.google.accounts.id.prompt();
    } catch (error) {
      console.error('Google prompt failed:', error);
      // Fallback: try to trigger the hidden button if available
      const hiddenButton = document.querySelector('[data-google-button]');
      if (hiddenButton) {
        (hiddenButton as HTMLElement).click();
      }
    }
  }, []);

  const renderGoogleButton = useCallback((element: HTMLElement, theme: 'outline' | 'filled_blue' = 'outline') => {
    if (!window.google || !element) {
      return;
    }

    try {
      // Add identifier for fallback
      element.setAttribute('data-google-button', 'true');

      window.google.accounts.id.renderButton(element, {
        theme,
        size: 'large',
        width: 400,
      });
    } catch (error) {
      console.error('Failed to render Google button:', error);
    }
  }, []);

  const loadGoogleScript = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google SDK'));

      document.head.appendChild(script);
    });
  }, []);

  return {
    initializeGoogleAuth,
    signInWithGoogle,
    renderGoogleButton,
    loadGoogleScript,
    isGoogleReady,
  };
};