import React from 'react';
import { Shield } from 'lucide-react';
import { GoogleLoginButton } from '../molecules/GoogleLoginButton';

interface LoginCardProps {
  onGoogleLogin: () => void;
  className?: string;
}

export const LoginCard: React.FC<LoginCardProps> = ({ 
  onGoogleLogin, 
  className = '' 
}) => {
  return (
    <div className={`bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/10 border border-white/30 p-8 mb-8 hover:shadow-3xl transition-all duration-500 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Bem-vindo de volta
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Faça login com sua conta Google para acessar a plataforma
        </p>
      </div>

      {/* Google OAuth Button */}
      <div className="mb-8">
        <GoogleLoginButton onLogin={onGoogleLogin} />
      </div>

      {/* Security Notice */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200/50">
        <div className="flex items-center space-x-2 text-orange-700 mb-2">
          <Shield className="w-5 h-5" />
          <span className="font-semibold">Login Seguro</span>
        </div>
        <p className="text-sm text-orange-600 leading-relaxed">
          Utilizamos autenticação SSO com Google para garantir a máxima
          segurança dos seus dados.
        </p>
      </div>
    </div>
  );
};
