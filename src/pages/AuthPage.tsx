import React from 'react';
import { LoginTemplate } from '../components/templates/LoginTemplate';
import { useAuth } from '../hooks/useAuth';

export const AuthPage: React.FC = () => {
  const { login, loginWithGoogle } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      const credentials = { email, password };
      await login(credentials);
    } catch (error) {
      console.error('🔐 AuthPage - Login failed:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Para demo, simular token do Google
      await loginWithGoogle('demo-google-token');
    } catch (error) {
      console.error('🔐 AuthPage - Google login failed:', error);
    }
  };

  return (
    <LoginTemplate onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} />
  );
};
