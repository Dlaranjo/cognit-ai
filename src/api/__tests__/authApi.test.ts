import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { authApi, authUtils } from '../authApi';
import { createMockServer } from '../mockServer';
import type { Server } from 'miragejs';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('authApi', () => {
  let server: Server;

  beforeEach(() => {
    server = createMockServer() as Server;
    vi.clearAllMocks();
  });

  afterEach(() => {
    server.shutdown();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const credentials = {
        email: 'joao@example.com',
        password: 'password',
      };

      const result = await authApi.login(credentials);

      expect(result).toEqual({
        user: expect.objectContaining({
          id: '1',
          email: 'joao@example.com',
          name: 'João Silva',
          role: 'admin',
        }),
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
        expiresIn: 3600,
      });
    });

    it('should reject with invalid credentials', async () => {
      const credentials = {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      };

      await expect(authApi.login(credentials)).rejects.toEqual({
        message: 'Credenciais inválidas',
        status: 400,
        code: undefined,
        details: { message: 'Credenciais inválidas' },
      });
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      localStorageMock.getItem.mockReturnValue('mock-refresh-token');

      await expect(authApi.logout()).resolves.toBeUndefined();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('authToken');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken');
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const refreshToken = 'mock-refresh-token';

      const result = await authApi.refreshToken(refreshToken);

      expect(result).toEqual({
        token: 'new-mock-jwt-token',
        refreshToken: 'new-mock-refresh-token',
        expiresIn: 3600,
      });
    });
  });

  describe('validateToken', () => {
    it('should validate token and return user', async () => {
      const result = await authApi.validateToken();

      expect(result).toEqual(expect.objectContaining({
        id: '1',
        email: 'joao@example.com',
        name: 'João Silva',
        role: 'admin',
      }));
    });
  });

  describe('getProfile', () => {
    it('should get user profile', async () => {
      const result = await authApi.getProfile();

      expect(result).toEqual(expect.objectContaining({
        id: '1',
        email: 'joao@example.com',
        name: 'João Silva',
        role: 'admin',
      }));
    });
  });
});

describe('authUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isTokenExpired', () => {
    it('should return true for expired token', () => {
      // Token expired in the past
      const expiredPayload = { exp: Math.floor(Date.now() / 1000) - 3600 };
      const expiredToken = `header.${btoa(JSON.stringify(expiredPayload))}.signature`;

      expect(authUtils.isTokenExpired(expiredToken)).toBe(true);
    });

    it('should return false for valid token', () => {
      // Token expires in the future
      const validPayload = { exp: Math.floor(Date.now() / 1000) + 3600 };
      const validToken = `header.${btoa(JSON.stringify(validPayload))}.signature`;

      expect(authUtils.isTokenExpired(validToken)).toBe(false);
    });

    it('should return true for invalid token format', () => {
      expect(authUtils.isTokenExpired('invalid-token')).toBe(true);
    });
  });

  describe('getTokenPayload', () => {
    it('should extract payload from valid token', () => {
      const payload = { userId: '123', role: 'admin' };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;

      expect(authUtils.getTokenPayload(token)).toEqual(payload);
    });

    it('should return null for invalid token', () => {
      expect(authUtils.getTokenPayload('invalid-token')).toBeNull();
    });
  });

  describe('hasPermission', () => {
    const adminUser = { id: '1', email: 'admin@test.com', name: 'Admin', role: 'admin' as const, isEmailVerified: true, createdAt: '', updatedAt: '' };
    const regularUser = { id: '2', email: 'user@test.com', name: 'User', role: 'user' as const, isEmailVerified: true, createdAt: '', updatedAt: '' };
    const viewerUser = { id: '3', email: 'viewer@test.com', name: 'Viewer', role: 'viewer' as const, isEmailVerified: true, createdAt: '', updatedAt: '' };

    it('should allow admin to access everything', () => {
      expect(authUtils.hasPermission(adminUser, 'admin')).toBe(true);
      expect(authUtils.hasPermission(adminUser, 'user')).toBe(true);
      expect(authUtils.hasPermission(adminUser, 'viewer')).toBe(true);
    });

    it('should allow user to access user and viewer', () => {
      expect(authUtils.hasPermission(regularUser, 'admin')).toBe(false);
      expect(authUtils.hasPermission(regularUser, 'user')).toBe(true);
      expect(authUtils.hasPermission(regularUser, 'viewer')).toBe(true);
    });

    it('should only allow viewer to access viewer', () => {
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
      const authResponse = {
        user: { id: '1', email: 'test@test.com', name: 'Test', role: 'user' as const, isEmailVerified: true, createdAt: '', updatedAt: '' },
        token: 'test-token',
        refreshToken: 'test-refresh-token',
        expiresIn: 3600,
      };

      authUtils.saveTokens(authResponse);

      expect(localStorageMock.setItem).toHaveBeenCalledWith('authToken', 'test-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('refreshToken', 'test-refresh-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('currentUser', JSON.stringify(authResponse.user));
    });

    it('should clear tokens from localStorage', () => {
      authUtils.clearTokens();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('authToken');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('currentUser');
    });
  });

  describe('getCurrentUser', () => {
    it('should get user from localStorage', () => {
      const user = { id: '1', email: 'test@test.com', name: 'Test', role: 'user' as const, isEmailVerified: true, createdAt: '', updatedAt: '' };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(user));

      const result = authUtils.getCurrentUser();

      expect(result).toEqual(user);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('currentUser');
    });

    it('should return null if no user in localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = authUtils.getCurrentUser();

      expect(result).toBeNull();
    });

    it('should return null if user data is corrupted', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');

      const result = authUtils.getCurrentUser();

      expect(result).toBeNull();
    });
  });
});