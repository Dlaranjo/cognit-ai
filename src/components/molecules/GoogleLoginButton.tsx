import React from 'react';

interface GoogleLoginButtonProps {
  onLogin: () => void;
  className?: string;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ 
  onLogin, 
  className = '' 
}) => {
  return (
    <button
      onClick={onLogin}
      className={`w-full flex items-center justify-center py-4 px-6 bg-gradient-to-r from-orange-500 to-red-500 border-2 border-orange-400 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:from-orange-600 hover:to-red-600 hover:border-orange-500 active:scale-[0.98] group relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
      <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
        <path
          fill="white"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="white"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="white"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="white"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      <span className="text-white font-bold text-lg transition-colors relative z-10">
        Entrar com Google
      </span>
    </button>
  );
};
