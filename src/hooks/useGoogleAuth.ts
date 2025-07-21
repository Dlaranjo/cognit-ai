import { useCallback, useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { config } from '../shared/config';

// Google OAuth types
interface GoogleAuthConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
}

interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
}

interface GooglePromptNotification {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
  getNotDisplayedReason: () => string;
  getSkippedReason: () => string;
}

interface GoogleButtonConfig {
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: string;
  locale?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleAuthConfig) => void;
          prompt: () => void;
          renderButton: (
            element: HTMLElement,
            config: GoogleButtonConfig
          ) => void;
          disableAutoSelect: () => void;
        };
      };
    };
    gapi?: unknown;
  }
}

export const useGoogleAuth = () => {
  const { loginWithGoogle } = useAuth();
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check if Google is ready
  useEffect(() => {
    const checkGoogleReady = () => {
      const ready = !!window.google?.accounts?.id && !!config.GOOGLE_CLIENT_ID;
      setIsGoogleReady(ready);

      if (ready && !isInitialized) {
        // Initialize Google Auth directly here to avoid dependency issues
        if (window.google?.accounts?.id && config.GOOGLE_CLIENT_ID) {
          try {
            window.google.accounts.id.initialize({
              client_id: config.GOOGLE_CLIENT_ID,
              callback: handleGoogleCallback,
              auto_select: false,
              cancel_on_tap_outside: false,
              context: 'signin',
              ux_mode: 'popup',
              use_fedcm_for_prompt: false,
            });

            setIsInitialized(true);
          } catch (error) {
            console.error('❌ Failed to initialize Google OAuth:', error);
          }
        }
      }
    };

    checkGoogleReady();

    // Check periodically for Google SDK
    const interval = setInterval(checkGoogleReady, 500);
    const timeout = setTimeout(() => clearInterval(interval), 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isInitialized, handleGoogleCallback]);

  const handleGoogleCallback = useCallback(
    async (response: GoogleCredentialResponse) => {
      try {
        if (response.credential) {
          await loginWithGoogle(response.credential);
        } else {
          console.error('❌ No credential in Google response');
          throw new Error('No credential received from Google');
        }
      } catch (error) {
        console.error('❌ Google auth callback failed:', error);
        // Don't throw here, let the component handle fallback
      }
    },
    [loginWithGoogle]
  );

  const initializeGoogleAuth = useCallback(() => {
    if (!window.google?.accounts?.id || !config.GOOGLE_CLIENT_ID) {
      console.warn('⚠️ Google OAuth not configured properly');
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: config.GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
        auto_select: false,
        cancel_on_tap_outside: false,
        context: 'signin',
        ux_mode: 'popup',
        use_fedcm_for_prompt: false,
      });
    } catch (error) {
      console.error('❌ Failed to initialize Google OAuth:', error);
    }
  }, [handleGoogleCallback]);

  const signInWithGoogle = useCallback(() => {
    if (!window.google?.accounts?.id) {
      console.error('❌ Google SDK not loaded');
      return Promise.reject(new Error('Google SDK not available'));
    }

    return new Promise<void>((resolve, reject) => {
      try {
        // Disable auto-select to force user interaction
        window.google!.accounts.id.disableAutoSelect();

        // Show the One Tap prompt
        window.google!.accounts.id.prompt(
          (notification: GooglePromptNotification) => {
            if (notification.isNotDisplayed()) {
              // If prompt fails, we'll rely on the fallback in the component
              resolve();
            } else if (notification.isSkippedMoment()) {
              resolve();
            } else if (notification.isDismissedMoment()) {
              resolve();
            } else {
              // Prompt was displayed successfully
              resolve();
            }
          }
        );
      } catch (error) {
        console.error('❌ Google sign-in failed:', error);
        reject(error);
      }
    });
  }, []);

  const renderGoogleButton = useCallback(
    (element: HTMLElement, theme: 'outline' | 'filled_blue' = 'outline') => {
      if (!window.google?.accounts?.id || !element) {
        console.warn(
          '⚠️ Cannot render Google button - SDK not ready or element missing'
        );
        return;
      }

      try {
        // Clear any existing content
        element.innerHTML = '';

        // Add identifier for fallback
        element.setAttribute('data-google-button', 'true');

        window.google.accounts.id.renderButton(element, {
          theme,
          size: 'large',
          width: 400,
          type: 'standard',
          shape: 'rectangular',
          logo_alignment: 'left',
          text: 'signin_with',
        });
      } catch (error) {
        console.error('❌ Failed to render Google button:', error);
      }
    },
    []
  );

  const loadGoogleScript = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.google?.accounts?.id) {
        resolve();
        return;
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector(
        'script[src*="accounts.google.com"]'
      );
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve());
        existingScript.addEventListener('error', () =>
          reject(new Error('Failed to load Google SDK'))
        );
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        // Give it a moment to initialize
        setTimeout(() => resolve(), 100);
      };

      script.onerror = () => {
        console.error('❌ Failed to load Google SDK script');
        reject(new Error('Failed to load Google SDK'));
      };

      document.head.appendChild(script);
    });
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.disableAutoSelect();
      } catch (error) {
        console.warn('⚠️ Error during Google auth cleanup:', error);
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    initializeGoogleAuth,
    signInWithGoogle,
    renderGoogleButton,
    loadGoogleScript,
    isGoogleReady,
    isInitialized,
    cleanup,
  };
};
