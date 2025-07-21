import React from 'react';
import { LoginTemplate } from '../components/templates/LoginTemplate';
import { useAuth } from '../hooks/useAuth';

export const AuthPage: React.FC = () => {
  const { login } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      // For demo purposes, create mock credentials
      const credentials = { email, password };
      await login(credentials);
    } catch (error) {
      console.error('🔐 AuthPage - Login failed:', error);
    }
  };

  return <LoginTemplate onLogin={handleLogin} />;
};
