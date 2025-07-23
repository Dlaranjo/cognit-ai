import { createAsyncThunk } from '@reduxjs/toolkit';
import { logger } from '../../shared/utils';
import {
  authApi,
  type LoginCredentials,
  type AuthResponse,
} from '../../api/authApi';

export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authApi.login(credentials);
    localStorage.setItem('token', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Login failed';
    return rejectWithValue(errorMessage);
  }
});

export const googleAuth = createAsyncThunk<
  AuthResponse,
  string,
  { rejectValue: string }
>('auth/googleAuth', async (googleToken, { rejectWithValue }) => {
  try {
    const response = await authApi.googleAuth({ token: googleToken });
    localStorage.setItem('token', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  } catch (error: unknown) {
    logger.error('❌ Google auth action failed:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Google auth failed';
    return rejectWithValue(errorMessage);
  }
});

export const refreshToken = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: string }
>('auth/refreshToken', async (_, { rejectWithValue }) => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await authApi.refreshToken(refreshToken);
    localStorage.setItem('token', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  } catch (error: unknown) {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    const errorMessage =
      error instanceof Error ? error.message : 'Token refresh failed';
    return rejectWithValue(errorMessage);
  }
});

export const validateToken = createAsyncThunk<
  { user: unknown; token: string },
  void,
  { rejectValue: string }
>('auth/validateToken', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token available');
    }

    const user = await authApi.validateToken();
    return { user, token };
  } catch (error: unknown) {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    const errorMessage =
      error instanceof Error ? error.message : 'Token validation failed';
    return rejectWithValue(errorMessage);
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logoutUser',
  async () => {
    try {
      await authApi.logout();
    } catch (error: unknown) {
      // Continue with logout even if API call fails
      logger.error('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  }
);
