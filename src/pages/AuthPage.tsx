import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginTemplate } from '../components/templates/LoginTemplate';
import { useAuth } from '../hooks/useAuth';

export const AuthPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect after successful authentication
  useEffect(() => {
    if (isAuthenticated) {
      // Use the intended destination or default to /studio
      const from =
        (location.state as { from?: Location })?.from?.pathname || '/studio';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const handleLogin = async (email: string, password: string) => {
    try {
      // For demo purposes, create mock credentials
      const credentials = { email, password };
      await login(credentials);
      // Navigation will be handled by useEffect above
    } catch (error) {
      console.error('🔐 AuthPage - Login failed:', error);
    }
  };

  return <LoginTemplate onLogin={handleLogin} />;
};
