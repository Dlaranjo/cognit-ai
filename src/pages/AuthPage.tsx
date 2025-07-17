import React from 'react';
import { LoginScreen } from '../components/Auth/LoginScreen';
import { useAuth } from '../hooks/useAuth';

export const AuthPage: React.FC = () => {
  const { login } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log('🔐 AuthPage - handleLogin called with:', { email, password });
      // For demo purposes, create mock credentials
      const credentials = { email, password };
      console.log('🔐 AuthPage - calling login with credentials:', credentials);
      const result = await login(credentials);
      console.log('🔐 AuthPage - login result:', result);
    } catch (error) {
      console.error('🔐 AuthPage - Login failed:', error);
    }
  };

  return <LoginScreen onLogin={handleLogin} />;
};