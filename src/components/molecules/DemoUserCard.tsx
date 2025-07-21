import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface DemoUser {
  name: string;
  role: string;
  email: string;
  avatar: string;
  color: string;
  icon: string;
}

interface DemoUserCardProps {
  user: DemoUser;
  onLogin: (email: string, password: string) => void;
  className?: string;
}

export const DemoUserCard: React.FC<DemoUserCardProps> = ({ 
  user, 
  onLogin, 
  className = '' 
}) => {
  return (
    <button
      onClick={() => onLogin(user.email, 'demo-sso-token')}
      className={`w-full flex items-center justify-between p-4 bg-white/60 hover:bg-white/90 rounded-xl border border-gray-200/50 hover:border-orange-200 transition-all duration-300 group hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] ${className}`}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className={`absolute inset-0 bg-gradient-to-r ${user.color} rounded-full blur-sm opacity-30 group-hover:opacity-50 transition-opacity`}></div>
          <img
            src={user.avatar}
            alt={user.name}
            className="relative w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200">
            <span className="text-xs">{user.icon}</span>
          </div>
        </div>
        <div className="text-left">
          <p className="font-semibold text-gray-900 group-hover:text-orange-700 transition-colors">{user.name}</p>
          <p className="text-sm text-gray-500">
            {user.role} • {user.email}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${user.color} opacity-60 group-hover:opacity-100 transition-opacity`}></div>
        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 group-hover:translate-x-1 transition-all duration-300" />
      </div>
    </button>
  );
};
