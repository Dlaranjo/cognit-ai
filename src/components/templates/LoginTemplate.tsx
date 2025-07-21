import React from 'react';
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onGoogleLogin?: () => Promise<void>; // Future integration point
}

export const LoginTemplate: React.FC<LoginScreenProps> = ({
  onLogin,
  onGoogleLogin,
}) => {
  // Future: Google auth will be handled via backend integration
  const handleGoogleLogin = async () => {
    try {
      if (onGoogleLogin) {
        await onGoogleLogin();
      } else {
        // Temporary fallback to demo login until backend integration
        await onLogin('ricardo@cognit.com', 'demo-sso-token');
      }
    } catch (error) {
      console.error('❌ Google auth failed:', error);
      // Fallback to demo login
      await onLogin('ricardo@cognit.com', 'demo-sso-token');
    }
  };

  const quickLoginOptions = [
    {
      name: 'Ricardo Almeida',
      role: 'Admin',
      email: 'ricardo@cognit.com',
      avatar:
        'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
    },
    {
      name: 'Ana Silva',
      role: 'Editor',
      email: 'ana@cognit.com',
      avatar:
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
    },
    {
      name: 'Carlos Santos',
      role: 'Viewer',
      email: 'carlos@cognit.com',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
    },
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
          <p className="text-gray-600 text-lg font-medium">
            Knowledge Base Platform
          </p>
          <div className="flex items-center justify-center space-x-1 mt-2">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-gray-500">Powered by AI</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/10 border border-white/20 p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Bem-vindo de volta
            </h2>
            <p className="text-gray-600">
              Faça login com sua conta Google para acessar a plataforma
            </p>
          </div>

          {/* Google OAuth Button - Ready for Backend Integration */}
          <div className="mb-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center py-4 px-6 bg-white border-2 border-gray-300 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-gray-400 active:scale-[0.98] group"
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-700 font-semibold text-lg group-hover:text-gray-900 transition-colors">
                Entrar com Google
              </span>
            </button>
          </div>

          {/* Security Notice */}
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center space-x-2 text-orange-700 mb-2">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Login Seguro</span>
            </div>
            <p className="text-sm text-orange-600">
              Utilizamos autenticação SSO com Google para garantir a máxima
              segurança dos seus dados.
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
                    <p className="text-sm text-gray-500">
                      {option.role} • {option.email}
                    </p>
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
            <a href="#" className="hover:text-orange-500 transition-colors">
              Política de Privacidade
            </a>
            <span>•</span>
            <a href="#" className="hover:text-orange-500 transition-colors">
              Termos de Uso
            </a>
            <span>•</span>
            <a href="#" className="hover:text-orange-500 transition-colors">
              Suporte
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
