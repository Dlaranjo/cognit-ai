import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../types';

// Base selectors
export const selectAuthState = (state: RootState) => state.auth;

// Memoized selectors
export const selectUser = createSelector(
  [selectAuthState],
  (auth) => auth.user
);

export const selectIsAuthenticated = createSelector(
  [selectAuthState],
  (auth) => auth.isAuthenticated
);

export const selectAuthToken = createSelector(
  [selectAuthState],
  (auth) => auth.token
);

export const selectAuthLoading = createSelector(
  [selectAuthState],
  (auth) => auth.isLoading
);

export const selectAuthError = createSelector(
  [selectAuthState],
  (auth) => auth.error
);

export const selectUserRole = createSelector(
  [selectUser],
  (user) => user?.role
);

export const selectUserName = createSelector(
  [selectUser],
  (user) => user?.name
);

export const selectUserEmail = createSelector(
  [selectUser],
  (user) => user?.email
);

export const selectUserAvatar = createSelector(
  [selectUser],
  (user) => user?.avatar
);
