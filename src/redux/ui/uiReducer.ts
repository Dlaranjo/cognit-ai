import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UIState, ModalPayload, NotificationPayload, Notification } from './uiTypes';

const initialState: UIState = {
  modals: {},
  notifications: [],
  theme: 'light',
  sidebarCollapsed: false,
  loading: {},
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Modal management
    openModal: (state, action: PayloadAction<ModalPayload>) => {
      const { modalId, data } = action.payload;
      state.modals[modalId] = {
        isOpen: true,
        data,
      };
    },
    closeModal: (state, action: PayloadAction<string>) => {
      const modalId = action.payload;
      if (state.modals[modalId]) {
        state.modals[modalId].isOpen = false;
        state.modals[modalId].data = undefined;
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(modalId => {
        state.modals[modalId].isOpen = false;
        state.modals[modalId].data = undefined;
      });
    },

    // Notification management
    addNotification: (state, action: PayloadAction<NotificationPayload>) => {
      const notification: Notification = {
        id: Date.now().toString(),
        timestamp: new Date(),
        duration: 5000,
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Theme management
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },

    // Sidebar management
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    // Loading states
    setLoading: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      const { key, loading } = action.payload;
      state.loading[key] = loading;
    },
    clearLoading: (state, action: PayloadAction<string>) => {
      delete state.loading[action.payload];
    },
    clearAllLoading: (state) => {
      state.loading = {};
    },
  },
});

export const {
  openModal,
  closeModal,
  closeAllModals,
  addNotification,
  removeNotification,
  clearNotifications,
  setTheme,
  toggleTheme,
  setSidebarCollapsed,
  toggleSidebar,
  setLoading,
  clearLoading,
  clearAllLoading,
} = uiSlice.actions;

export const uiReducer = uiSlice.reducer;
