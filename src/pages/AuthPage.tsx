import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LoginTemplate } from '../components/templates/LoginTemplate';
import { useAuth } from '../hooks/useAuth';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { setUser } from '../redux/auth/authReducer';

export const AuthPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { loginWithGoogle } = useGoogleAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      // Check for demo authentication
      if (password === 'demo-sso-token') {
        // Create mock user object
        const mockUser = {
          id: '1',
          email: email,
          name: email.split('@')[0],
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=ea580c&color=fff`
        };
        
        // Set dummy tokens in localStorage
        localStorage.setItem('token', 'demo-token-123');
        localStorage.setItem('refreshToken', 'demo-refresh-token-456');
        
        // Dispatch user to Redux store
        dispatch(setUser(mockUser));
        
        // Navigate to studio
        navigate('/studio');
      } else {
        const credentials = { email, password };
        await login(credentials);
      }
    } catch (error) {
      console.error('🔐 AuthPage - Login failed:', error);
      throw new Error('Login failed');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      
      if (result) {
        // Set dummy tokens in localStorage
        localStorage.setItem('token', 'demo-google-token-123');
        localStorage.setItem('refreshToken', 'demo-google-refresh-token-456');
        
        // Dispatch user to Redux store
        dispatch(setUser(result));
        
        // Navigate to studio
        navigate('/studio');
      }
    } catch (error) {
      console.error('🔐 AuthPage - Google login failed:', error);
    }
  };

  return (
    <LoginTemplate onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} />
  );
};
