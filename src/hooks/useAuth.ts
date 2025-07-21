import { useCallback } from 'react';
import { useNavigate, useLocation, type Location } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/store';
import {
  loginUser,
  googleAuth,
  refreshToken,
  validateToken,
  logoutUser,
} from '../redux/auth/authActions';
import { clearError } from '../redux/auth/authReducer';
import {
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectAuthToken,
  selectUserRole,
} from '../redux/auth/authSelectors';
import type { LoginCredentials } from '../api/authApi';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Selectors
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const token = useAppSelector(selectAuthToken);
  const userRole = useAppSelector(selectUserRole);

  // Actions
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const result = await dispatch(loginUser(credentials)).unwrap();
      // Redirecionar após login bem-sucedido
      const from =
        (location.state as { from?: Location })?.from?.pathname || '/studio';
      navigate(from, { replace: true });
      return result;
    },
    [dispatch, navigate, location.state]
  );

  const loginWithGoogle = useCallback(
    async (googleToken: string) => {
      const result = await dispatch(googleAuth(googleToken)).unwrap();
      // Redirecionar após login bem-sucedido
      const from =
        (location.state as { from?: Location })?.from?.pathname || '/studio';
      navigate(from, { replace: true });
      return result;
    },
    [dispatch, navigate, location.state]
  );

  const logout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  const refresh = useCallback(() => {
    return dispatch(refreshToken());
  }, [dispatch]);

  const validate = useCallback(() => {
    return dispatch(validateToken());
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Permission system
  const hasPermission = useCallback(
    (action: string, workspacePermission?: 'owner' | 'editor' | 'viewer') => {
      switch (action) {
        case 'CREATE_WORKSPACE':
          return userRole === 'admin';
        case 'CREATE_PROJECT':
          return workspacePermission === 'owner';
        case 'ADD_DOCUMENT':
          return (
            workspacePermission === 'owner' || workspacePermission === 'editor'
          );
        case 'VIEW_PROJECTS':
          return (
            workspacePermission === 'owner' || workspacePermission === 'editor'
          );
        default:
          return false;
      }
    },
    [userRole]
  );

  // Computed values
  const isAdmin = userRole === 'admin';
  const isUser = userRole === 'user';

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    token,
    userRole,

    // Computed
    isAdmin,
    isUser,

    // Actions
    login,
    loginWithGoogle,
    logout,
    refresh,
    validate,
    clearAuthError,
    hasPermission,
  };
};
