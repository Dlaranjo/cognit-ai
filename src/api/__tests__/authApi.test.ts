import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authApi, authUtils } from '../authApi';
import { apiClient } from '../axiosConfig';

// Mock the apiClient
vi.mock('../axiosConfig', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

const mockedApiClient = apiClient as {
  post: ReturnType<typeof vi.fn>;
  get: ReturnType<typeof vi.fn>;
};

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockResponse = {
        data: {
          token: 'mock-jwt-token',
          refreshToken: 'mock-refresh-token',
          user: {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            role: 'user',
          },
        },
      };

      mockedApiClient.post.mockResolvedValue(mockResponse);

      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await authApi.login(credentials);

      expect(mockedApiClient.post).toHaveBeenCalledWith(
        '/auth/login',
        credentials
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should reject with invalid credentials', async () => {
      const mockError = {
        response: {
          status: 400,
          data: { message: 'Credenciais inválidas' },
        },
      };

      mockedApiClient.post.mockRejectedValue(mockError);

      const credentials = {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      };

      await expect(authApi.login(credentials)).rejects.toEqual({
        message: 'Credenciais inválidas',
        status: 400,
        code: 'ERR_BAD_REQUEST',
        details: { message: 'Credenciais inválidas' },
      });
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
      mockedApiClient.post.mockResolvedValue({ data: {} });

      await expect(authApi.logout()).resolves.toBeUndefined();

      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(localStorage.getItem('currentUser')).toBeNull();
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const mockResponse = {
        data: {
          token: 'new-mock-jwt-token',
          refreshToken: 'new-mock-refresh-token',
        },
      };

      localStorage.setItem('refreshToken', 'old-refresh-token');
      mockedApiClient.post.mockResolvedValue(mockResponse);

      const result = await authApi.refreshToken();

      expect(result).toEqual(mockResponse.data);
      expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/refresh', {
        refreshToken: 'old-refresh-token',
      });
    });
  });

  describe('validateToken', () => {
    it('should validate token and return user', async () => {
      const mockResponse = {
        data: {
          user: {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            role: 'user',
          },
        },
      };

      mockedApiClient.get.mockResolvedValue(mockResponse);

      const result = await authApi.validateToken();

      expect(result).toEqual(mockResponse.data);
      expect(mockedApiClient.get).toHaveBeenCalledWith('/auth/validate');
    });
  });

  describe('getProfile', () => {
    it('should get user profile', async () => {
      const mockResponse = {
        data: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'user',
        },
      };

      mockedApiClient.get.mockResolvedValue(mockResponse);

      const result = await authApi.getProfile();

      expect(result).toEqual(mockResponse.data);
      expect(mockedApiClient.get).toHaveBeenCalledWith('/auth/profile');
    });
  });
});

describe('authUtils', () => {
  describe('isTokenExpired', () => {
    it('should return true for expired token', () => {
      // Create an expired token (exp in the past)
      const expiredToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.invalid';
      expect(authUtils.isTokenExpired(expiredToken)).toBe(true);
    });

    it('should return false for valid token', () => {
      // Create a future token (exp in the future)
      const futureTimestamp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const validToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({ exp: futureTimestamp }))}.signature`;
      expect(authUtils.isTokenExpired(validToken)).toBe(false);
    });

    it('should return true for invalid token format', () => {
      expect(authUtils.isTokenExpired('invalid-token')).toBe(true);
    });
  });

  describe('getTokenPayload', () => {
    it('should extract payload from valid token', () => {
      const payload = { userId: '123', role: 'user' };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;

      expect(authUtils.getTokenPayload(token)).toEqual(payload);
    });

    it('should return null for invalid token', () => {
      expect(authUtils.getTokenPayload('invalid-token')).toBeNull();
    });
  });

  describe('hasPermission', () => {
    it('should allow admin to access everything', () => {
      const adminUser = { role: 'admin' as const };
      expect(authUtils.hasPermission(adminUser, 'admin')).toBe(true);
      expect(authUtils.hasPermission(adminUser, 'user')).toBe(true);
      expect(authUtils.hasPermission(adminUser, 'viewer')).toBe(true);
    });

    it('should allow user to access user and viewer', () => {
      const regularUser = { role: 'user' as const };
      expect(authUtils.hasPermission(regularUser, 'admin')).toBe(false);
      expect(authUtils.hasPermission(regularUser, 'user')).toBe(true);
      expect(authUtils.hasPermission(regularUser, 'viewer')).toBe(true);
    });

    it('should only allow viewer to access viewer', () => {
      const viewerUser = { role: 'viewer' as const };
      expect(authUtils.hasPermission(viewerUser, 'admin')).toBe(false);
      expect(authUtils.hasPermission(viewerUser, 'user')).toBe(false);
      expect(authUtils.hasPermission(viewerUser, 'viewer')).toBe(true);
    });

    it('should return false for null user', () => {
      expect(authUtils.hasPermission(null, 'viewer')).toBe(false);
    });
  });

  describe('saveTokens and clearTokens', () => {
    it('should save tokens to localStorage', () => {
      authUtils.saveTokens('access-token', 'refresh-token');

      expect(localStorage.getItem('authToken')).toBe('access-token');
      expect(localStorage.getItem('refreshToken')).toBe('refresh-token');
    });

    it('should clear tokens from localStorage', () => {
      localStorage.setItem('authToken', 'some-token');
      localStorage.setItem('refreshToken', 'some-refresh');
      localStorage.setItem('currentUser', 'some-user');

      authUtils.clearTokens();

      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
      expect(localStorage.getItem('currentUser')).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should get user from localStorage', () => {
      const user = { id: '1', name: 'Test' };
      localStorage.setItem('currentUser', JSON.stringify(user));

      expect(authUtils.getCurrentUser()).toEqual(user);
    });

    it('should return null if no user in localStorage', () => {
      expect(authUtils.getCurrentUser()).toBeNull();
    });

    it('should return null if user data is corrupted', () => {
      localStorage.setItem('currentUser', 'invalid-json');
      expect(authUtils.getCurrentUser()).toBeNull();
    });
  });
});
