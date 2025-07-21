import React from 'react';
import { Zap } from 'lucide-react';
import { DemoUserCard, type DemoUser } from '../molecules/DemoUserCard';

interface DemoAccessSectionProps {
  demoUsers: DemoUser[];
  onDemoLogin: (email: string, password: string) => void;
  className?: string;
}

export const DemoAccessSection: React.FC<DemoAccessSectionProps> = ({ 
  demoUsers, 
  onDemoLogin, 
  className = '' 
}) => {
  return (
    <div className={`bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/5 border border-white/30 p-6 hover:bg-white/80 transition-all duration-300 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Zap className="w-5 h-5 text-orange-500" />
        <h3 className="text-lg font-bold text-gray-900">Acesso Demo</h3>
      </div>
      <p className="text-sm text-gray-600 mb-5 leading-relaxed">
        Para demonstração, você pode acessar com um dos perfis abaixo:
      </p>
      <div className="space-y-3">
        {demoUsers.map((user, index) => (
          <DemoUserCard
            key={index}
            user={user}
            onLogin={onDemoLogin}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500 text-center mt-5 bg-gray-50/50 rounded-lg py-2 px-3">
        Clique em qualquer perfil para acesso demo
      </p>
    </div>
  );
};
