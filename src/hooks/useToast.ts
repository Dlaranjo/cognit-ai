import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import {
  addNotification,
  removeNotification,
  clearNotifications,
} from '../redux/ui/uiReducer';
import {
  selectNotifications,
  selectActiveNotifications,
  selectNotificationsByType,
  selectLatestNotification,
} from '../redux/ui/uiSelectors';
import type { NotificationPayload } from '../redux/ui/uiTypes';

export const useToast = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const notifications = useAppSelector(selectNotifications);
  const activeNotifications = useAppSelector(selectActiveNotifications);
  const latestNotification = useAppSelector(selectLatestNotification);

  // Actions
  const showToast = useCallback((notification: NotificationPayload) => {
    dispatch(addNotification(notification));
  }, [dispatch]);

  const hideToast = useCallback((notificationId: string) => {
    dispatch(removeNotification(notificationId));
  }, [dispatch]);

  const clearAllToasts = useCallback(() => {
    dispatch(clearNotifications());
  }, [dispatch]);

  // Convenience methods for different toast types
  const showSuccess = useCallback((title: string, message?: string, duration?: number) => {
    showToast({
      type: 'success',
      title,
      message,
      duration,
    });
  }, [showToast]);

  const showError = useCallback((title: string, message?: string, duration?: number) => {
    showToast({
      type: 'error',
      title,
      message,
      duration: duration || 0, // Error toasts don't auto-dismiss by default
    });
  }, [showToast]);

  const showWarning = useCallback((title: string, message?: string, duration?: number) => {
    showToast({
      type: 'warning',
      title,
      message,
      duration,
    });
  }, [showToast]);

  const showInfo = useCallback((title: string, message?: string, duration?: number) => {
    showToast({
      type: 'info',
      title,
      message,
      duration,
    });
  }, [showToast]);

  // Helper functions - this returns a selector function, not a hook call
  const getNotificationsByType = useCallback((type: 'success' | 'error' | 'warning' | 'info') => {
    // This returns a function that can be used with useAppSelector later
    return (state: any) => selectNotificationsByType(state, type);
  }, []);

  // Auto-dismiss functionality
  const dismissAfter = useCallback((notificationId: string, delay: number) => {
    setTimeout(() => {
      hideToast(notificationId);
    }, delay);
  }, [hideToast]);

  // Computed values
  const hasNotifications = notifications.length > 0;
  const hasActiveNotifications = activeNotifications.length > 0;
  const notificationCount = notifications.length;
  const activeNotificationCount = activeNotifications.length;

  return {
    // State
    notifications,
    activeNotifications,
    latestNotification,
    
    // Computed
    hasNotifications,
    hasActiveNotifications,
    notificationCount,
    activeNotificationCount,
    
    // Actions
    showToast,
    hideToast,
    clearAllToasts,
    
    // Convenience methods
    showSuccess,
    showError,
    showWarning,
    showInfo,
    
    // Helpers
    getNotificationsByType,
    dismissAfter,
  };
};
