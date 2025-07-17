import { apiClient } from './axiosConfig';

// Interfaces de autenticação
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  avatar?: string;
}

// Interface do usuário
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user' | 'viewer';
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'pt' | 'en';
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  defaultModel?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface GoogleAuthRequest {
  token: string;
  isNewUser?: boolean;
}

export interface EmailVerificationRequest {
  token: string;
}



// API methods
export const authApi = {
  // Login básico
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // Registro de usuário
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', credentials);
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await apiClient.post('/auth/logout', { refreshToken });
    }
    
    // Limpar tokens localmente
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  // Validar token atual
  validateToken: async (): Promise<User> => {
    const response = await apiClient.get('/auth/validate');
    return response.data;
  },

  // Autenticação Google OAuth
  googleAuth: async (request: GoogleAuthRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/google', request);
    return response.data;
  },

  // Esqueceu senha
  forgotPassword: async (request: ForgotPasswordRequest): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/forgot-password', request);
    return response.data;
  },

  // Reset de senha
  resetPassword: async (request: ResetPasswordRequest): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/reset-password', request);
    return response.data;
  },

  // Alterar senha (usuário logado)
  changePassword: async (request: ChangePasswordRequest): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/change-password', request);
    return response.data;
  },

  // Atualizar perfil
  updateProfile: async (request: UpdateProfileRequest): Promise<User> => {
    const response = await apiClient.put('/auth/profile', request);
    return response.data;
  },

  // Obter perfil atual
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  // Verificar email
  verifyEmail: async (request: EmailVerificationRequest): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/verify-email', request);
    return response.data;
  },

  // Reenviar email de verificação
  resendVerificationEmail: async (): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/resend-verification');
    return response.data;
  },

  // Atualizar preferências do usuário
  updatePreferences: async (preferences: Partial<UserPreferences>): Promise<UserPreferences> => {
    const response = await apiClient.put('/auth/preferences', preferences);
    return response.data;
  },

  // Deletar conta
  deleteAccount: async (password: string): Promise<{ message: string }> => {
    const response = await apiClient.delete('/auth/account', {
      data: { password }
    });
    return response.data;
  },

  // Obter sessões ativas
  getActiveSessions: async (): Promise<Session[]> => {
    const response = await apiClient.get('/auth/sessions');
    return response.data;
  },

  // Revogar sessão específica
  revokeSession: async (sessionId: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/auth/sessions/${sessionId}`);
    return response.data;
  },

  // Revogar todas as sessões (exceto atual)
  revokeAllSessions: async (): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/revoke-all-sessions');
    return response.data;
  },
};

// Interface para sessões ativas
export interface Session {
  id: string;
  deviceInfo: string;
  ipAddress: string;
  location?: string;
  createdAt: string;
  lastActiveAt: string;
  isCurrent: boolean;
}

// Utilitários de autenticação
export const authUtils = {
  // Verificar se token está expirado
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },

  // Obter informações do token
  getTokenPayload: (token: string): { [key: string]: unknown } | null => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  },

  // Verificar se usuário tem permissão
  hasPermission: (user: User | null, requiredRole: User['role']): boolean => {
    if (!user) return false;
    
    const roleHierarchy = {
      viewer: 0,
      user: 1,
      admin: 2,
    };

    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  },

  // Salvar tokens no localStorage de forma segura
  saveTokens: (authResponse: AuthResponse): void => {
    localStorage.setItem('authToken', authResponse.token);
    localStorage.setItem('refreshToken', authResponse.refreshToken);
    
    // Salvar informações do usuário
    localStorage.setItem('currentUser', JSON.stringify(authResponse.user));
  },

  // Limpar tokens e dados do usuário
  clearTokens: (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
  },

  // Obter usuário atual do localStorage
  getCurrentUser: (): User | null => {
    try {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },
};

export default authApi;
