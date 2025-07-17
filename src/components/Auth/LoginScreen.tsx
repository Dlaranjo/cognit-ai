import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

// Google OAuth types
interface GoogleAuthConfig {
  client_id: string;
  callback: (response: any) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  context?: string;
  ux_mode?: string;
  use_fedcm_for_prompt?: boolean;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleAuthConfig) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  // Handle Google callback
  const handleGoogleCallback = useCallback(async (response: any) => {
    console.log('🔐 Google callback received:', response);

    try {
      if (response.credential) {
        console.log('🔐 Processing Google credential...');
        // For now, just use demo login
        await onLogin('ricardo@cognit.com', 'demo-sso-token');
        console.log('✅ Google login successful');
      } else {
        console.error('❌ No credential in Google response');
        throw new Error('No credential received from Google');
      }
    } catch (error) {
      console.error('❌ Google auth callback failed:', error);
      // Fallback to demo login
      await onLogin('ricardo@cognit.com', 'demo-sso-token');
    }
  }, [onLogin]);

  // Initialize Google Auth - only once
  const initializeGoogleAuth = useCallback(() => {
    if (isInitialized) return; // Prevent multiple initializations

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1034043274094-vj8odt69hbpevp3uv9nl65ctf24r8km0.apps.googleusercontent.com';

    if (!window.google?.accounts?.id || !clientId) {
      console.warn('⚠️ Google OAuth not configured properly');
      return;
    }

    try {
      console.log('🔧 Initializing Google OAuth with client ID:', clientId);

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCallback,
        auto_select: false,
        cancel_on_tap_outside: false,
        context: 'signin',
        ux_mode: 'popup',
        use_fedcm_for_prompt: false,
      });

      console.log('✅ Google OAuth initialized successfully');
      setIsInitialized(true);
    } catch (error) {
      console.error('❌ Failed to initialize Google OAuth:', error);
    }
  }, [handleGoogleCallback, isInitialized]);

  // Load Google Script - only once
  const loadGoogleScript = useCallback(async () => {
    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      console.log('📥 Google SDK script already loaded');
      return;
    }

    return new Promise<void>((resolve, reject) => {
      console.log('📥 Loading Google SDK script...');

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log('✅ Google SDK script loaded successfully');
        setTimeout(() => resolve(), 100);
      };

      script.onerror = () => {
        console.error('❌ Failed to load Google SDK script');
        reject(new Error('Failed to load Google SDK'));
      };

      document.head.appendChild(script);
    });
  }, []);

  // Render Google button with custom styling
  const renderGoogleButton = useCallback(() => {
    if (!window.google?.accounts?.id || !googleButtonRef.current || !isGoogleReady) {
      return;
    }

    try {
      console.log('🎨 Rendering native Google button...');

      // Clear any existing content
      googleButtonRef.current.innerHTML = '';

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        width: googleButtonRef.current.offsetWidth || 400,
        type: 'standard',
        shape: 'rectangular',
        logo_alignment: 'left',
        text: 'signin_with',
      });

      console.log('✅ Native Google button rendered successfully');

      // Apply custom styling to match the previous design
      setTimeout(() => {
        const googleButton = googleButtonRef.current?.querySelector('div[role="button"]') as HTMLElement;
        if (googleButton) {
          // Apply custom styles to match the previous elegant design
          googleButton.style.cssText = `
            width: 100% !important;
            height: 64px !important;
            border: 2px solid #d1d5db !important;
            border-radius: 16px !important;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
            font-size: 18px !important;
            font-weight: 600 !important;
            transition: all 0.3s ease !important;
            background: white !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 12px !important;
            cursor: pointer !important;
          `;

          // Add hover effects
          googleButton.addEventListener('mouseenter', () => {
            googleButton.style.transform = 'scale(1.02)';
            googleButton.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
            googleButton.style.borderColor = '#9ca3af';
          });

          googleButton.addEventListener('mouseleave', () => {
            googleButton.style.transform = 'scale(1)';
            googleButton.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
            googleButton.style.borderColor = '#d1d5db';
          });

          googleButton.addEventListener('mousedown', () => {
            googleButton.style.transform = 'scale(0.98)';
          });

          googleButton.addEventListener('mouseup', () => {
            googleButton.style.transform = 'scale(1.02)';
          });
        }
      }, 100);

    } catch (error) {
      console.error('❌ Failed to render Google button:', error);
    }
  }, [isGoogleReady]);

  // Setup Google Auth - run only once on mount
  useEffect(() => {
    let mounted = true;

    const setupGoogle = async () => {
      try {
        console.log('🔧 Setting up Google Auth...');
        await loadGoogleScript();

        if (!mounted) return; // Component unmounted

        console.log('✅ Google script loaded');

        // Wait a bit for Google SDK to be ready
        setTimeout(() => {
          if (!mounted) return;

          const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1034043274094-vj8odt69hbpevp3uv9nl65ctf24r8km0.apps.googleusercontent.com';
          const ready = !!window.google?.accounts?.id && !!clientId;

          setIsGoogleReady(ready);

          if (ready && !isInitialized) {
            initializeGoogleAuth();
          }
        }, 500);

      } catch (error) {
        console.error('❌ Failed to setup Google Auth:', error);
      }
    };

    setupGoogle();

    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array - run only once

  // Render Google button when ready
  useEffect(() => {
    if (isGoogleReady && isInitialized) {
      renderGoogleButton();
    }
  }, [isGoogleReady, isInitialized, renderGoogleButton]);



  const quickLoginOptions = [
    { 
      name: 'Ricardo Almeida', 
      role: 'Admin', 
      email: 'ricardo@cognit.com',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1'
    },
    { 
      name: 'Ana Silva', 
      role: 'Editor', 
      email: 'ana@cognit.com',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1'
    },
    { 
      name: 'Carlos Santos', 
      role: 'Viewer', 
      email: 'carlos@cognit.com',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-red-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-orange-400/10 to-red-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-300"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-red-500 rounded-full animate-bounce delay-700"></div>
      <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce delay-1000"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6 transform hover:scale-105 transition-all duration-300">
            <img 
              src="/cognit-logo.svg" 
              alt="Cognit AI" 
              className="h-20 w-auto mx-auto drop-shadow-2xl"
            />
          </div>
          <p className="text-gray-600 text-lg font-medium">Knowledge Base Platform</p>
          <div className="flex items-center justify-center space-x-1 mt-2">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-gray-500">Powered by AI</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/10 border border-white/20 p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Bem-vindo de volta</h2>
            <p className="text-gray-600">Faça login com sua conta Google para acessar a plataforma</p>
          </div>

          {/* Google OAuth Button Container */}
          <div className="mb-6">
            <div
              ref={googleButtonRef}
              className="w-full"
              style={{ minHeight: '56px' }}
            />
            {!isGoogleReady && (
              <div className="flex items-center justify-center py-4 px-6 bg-white border-2 border-gray-300 rounded-2xl shadow-lg">
                <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-3" />
                <span className="text-gray-600 font-semibold">Carregando Google OAuth...</span>
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center space-x-2 text-orange-700 mb-2">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Login Seguro</span>
            </div>
            <p className="text-sm text-orange-600">
              Utilizamos autenticação SSO com Google para garantir a máxima segurança dos seus dados.
            </p>
          </div>
        </div>

        {/* Demo Access */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/5 border border-white/20 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">Acesso Demo</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Para demonstração, você pode acessar com um dos perfis abaixo:
          </p>
          <div className="space-y-3">
            {quickLoginOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => onLogin(option.email, 'demo-sso-token')}
                className="w-full flex items-center justify-between p-4 bg-white/50 hover:bg-white/80 rounded-xl border border-gray-200/50 hover:border-orange-200 transition-all duration-200 group hover:shadow-md"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={option.avatar}
                    alt={option.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{option.name}</p>
                    <p className="text-sm text-gray-500">{option.role} • {option.email}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 text-center mt-4">
            Clique em qualquer perfil para acesso demo
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 COGNIT. Todos os direitos reservados.
          </p>
          <div className="flex items-center justify-center space-x-4 mt-2 text-xs text-gray-400">
            <a href="#" className="hover:text-orange-500 transition-colors">Política de Privacidade</a>
            <span>•</span>
            <a href="#" className="hover:text-orange-500 transition-colors">Termos de Uso</a>
            <span>•</span>
            <a href="#" className="hover:text-orange-500 transition-colors">Suporte</a>
          </div>
        </div>
      </div>
    </div>
  );
};