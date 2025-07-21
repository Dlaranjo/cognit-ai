import { useCallback } from 'react';
import type { DemoUser } from '../components/molecules/DemoUserCard';

interface UseLoginLogicProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onGoogleLogin?: () => Promise<void>;
}

export const useLoginLogic = ({ onLogin, onGoogleLogin }: UseLoginLogicProps) => {
  const quickLoginOptions: DemoUser[] = [
    {
      name: 'Ricardo Almeida',
      role: 'Admin',
      email: 'ricardo@cognit.com',
      avatar:
        'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
      color: 'from-emerald-500 to-teal-600',
      icon: '👑',
    },
    {
      name: 'Ana Silva',
      role: 'Editor',
      email: 'ana@cognit.com',
      avatar:
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
      color: 'from-blue-500 to-indigo-600',
      icon: '✏️',
    },
    {
      name: 'Carlos Santos',
      role: 'Viewer',
      email: 'carlos@cognit.com',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
      color: 'from-gray-500 to-slate-600',
      icon: '👁️',
    },
  ];

  const handleGoogleLogin = useCallback(async () => {
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
  }, [onLogin, onGoogleLogin]);

  const handleDemoLogin = useCallback(async (email: string, password: string) => {
    try {
      await onLogin(email, password);
    } catch (error) {
      console.error('❌ Demo login failed:', error);
    }
  }, [onLogin]);

  return {
    quickLoginOptions,
    handleGoogleLogin,
    handleDemoLogin,
  };
};
