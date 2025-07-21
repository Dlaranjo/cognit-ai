import React from 'react';
import { LoginHeader } from '../molecules/LoginHeader';
import { LoginCard } from '../organisms/LoginCard';
import { DemoAccessSection } from '../organisms/DemoAccessSection';
import { useLoginLogic } from '../../hooks/useLoginLogic';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onGoogleLogin?: () => Promise<void>; // Future integration point
}

export const LoginTemplate: React.FC<LoginScreenProps> = ({
  onLogin,
  onGoogleLogin,
}) => {
  const { quickLoginOptions, handleGoogleLogin, handleDemoLogin } = useLoginLogic({
    onLogin,
    onGoogleLogin,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400/15 to-red-600/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-red-400/15 to-orange-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-orange-400/8 to-red-600/8 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Additional subtle elements */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-orange-300/10 to-red-400/10 rounded-full blur-2xl animate-pulse delay-300"></div>
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-gradient-to-tr from-red-300/10 to-orange-400/10 rounded-full blur-2xl animate-pulse delay-700"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-orange-400/60 rounded-full animate-bounce delay-300"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-red-500/60 rounded-full animate-bounce delay-700"></div>
      <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-orange-400/60 rounded-full animate-bounce delay-1000"></div>
      <div className="absolute top-1/3 right-20 w-1 h-1 bg-orange-300/50 rounded-full animate-bounce delay-500"></div>
      <div className="absolute bottom-1/3 left-16 w-1.5 h-1.5 bg-red-400/50 rounded-full animate-bounce delay-900"></div>

      <div className="w-full max-w-lg relative z-10">
        {/* Header Section */}
        <LoginHeader />

        {/* Login Card */}
        <LoginCard onGoogleLogin={handleGoogleLogin} />

        {/* Demo Access */}
        <DemoAccessSection
          demoUsers={quickLoginOptions}
          onDemoLogin={handleDemoLogin}
        />

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 font-medium">
            © 2025 COGNIT. Todos os direitos reservados.
          </p>
          <div className="flex items-center justify-center space-x-4 mt-3 text-xs text-gray-400">
            <a href="#" className="hover:text-orange-500 transition-colors duration-200 hover:underline">
              Política de Privacidade
            </a>
            <span>•</span>
            <a href="#" className="hover:text-orange-500 transition-colors duration-200 hover:underline">
              Termos de Uso
            </a>
            <span>•</span>
            <a href="#" className="hover:text-orange-500 transition-colors duration-200 hover:underline">
              Suporte
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
