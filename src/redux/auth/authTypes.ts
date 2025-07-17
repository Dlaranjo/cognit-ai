import type { User, LoginCredentials } from '../../api/authApi';

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface LoginPayload {
  credentials: LoginCredentials;
}

export interface GoogleAuthPayload {
  googleToken: string;
}
