import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../types';

// Base selectors
export const selectUIState = (state: RootState) => state.ui;

// Memoized selectors
export const selectModals = createSelector(
  [selectUIState],
  (ui) => ui.modals
);

export const selectNotifications = createSelector(
  [selectUIState],
  (ui) => ui.notifications
);

export const selectTheme = createSelector(
  [selectUIState],
  (ui) => ui.theme
);

export const selectSidebarCollapsed = createSelector(
  [selectUIState],
  (ui) => ui.sidebarCollapsed
);

export const selectLoadingStates = createSelector(
  [selectUIState],
  (ui) => ui.loading
);

// Modal selectors
export const selectModalById = createSelector(
  [selectModals, (state: RootState, modalId: string) => modalId],
  (modals, modalId) => modals[modalId]
);

export const selectIsModalOpen = createSelector(
  [selectModalById],
  (modal) => modal?.isOpen || false
);

export const selectModalData = createSelector(
  [selectModalById],
  (modal) => modal?.data
);

export const selectOpenModals = createSelector(
  [selectModals],
  (modals) => Object.entries(modals)
    .filter(([_, modal]) => modal.isOpen)
    .map(([id, modal]) => ({ id, ...modal }))
);

// Notification selectors
export const selectActiveNotifications = createSelector(
  [selectNotifications],
  (notifications) => notifications.filter(n => {
    if (!n.duration) return true;
    const now = new Date().getTime();
    const notificationTime = new Date(n.timestamp).getTime();
    return (now - notificationTime) < n.duration;
  })
);

export const selectNotificationsByType = createSelector(
  [selectNotifications, (state: RootState, type: string) => type],
  (notifications, type) => notifications.filter(n => n.type === type)
);

export const selectLatestNotification = createSelector(
  [selectNotifications],
  (notifications) => notifications[notifications.length - 1]
);

// Loading selectors
export const selectIsLoading = createSelector(
  [selectLoadingStates, (state: RootState, key: string) => key],
  (loadingStates, key) => loadingStates[key] || false
);

export const selectAnyLoading = createSelector(
  [selectLoadingStates],
  (loadingStates) => Object.values(loadingStates).some(loading => loading)
);

export const selectLoadingKeys = createSelector(
  [selectLoadingStates],
  (loadingStates) => Object.keys(loadingStates).filter(key => loadingStates[key])
);

// Theme selectors
export const selectIsDarkMode = createSelector(
  [selectTheme],
  (theme) => theme === 'dark'
);

export const selectIsLightMode = createSelector(
  [selectTheme],
  (theme) => theme === 'light'
);
