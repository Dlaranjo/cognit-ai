import React from 'react';
import { Sparkles, Shield, Zap } from 'lucide-react';

interface LoginHeaderProps {
  className?: string;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ className = '' }) => {
  return (
    <div className={`text-center mb-12 ${className}`}>
      {/* Main Logo */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 tracking-tight">
          Cognit
        </h1>
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-xl font-bold text-xl shadow-lg">
          AI
        </div>
      </div>

      {/* Subtitle */}
      <p className="text-xl text-gray-700 font-medium mb-2">
        Knowledge Base Platform
      </p>
      
      {/* Feature Badges */}
      <div className="flex items-center justify-center space-x-2 mt-3">
        <div className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 rounded-full border border-orange-200/50">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium text-orange-700">Powered by AI</span>
        </div>
        <div className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full border border-green-200/50">
          <Shield className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-green-700">Secure</span>
        </div>
        <div className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full border border-blue-200/50">
          <Zap className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-blue-700">Fast</span>
        </div>
      </div>

      {/* Decorative Line */}
      <div className="flex items-center justify-center mt-8 mb-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
        <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mx-4"></div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>
      </div>
    </div>
  );
};
