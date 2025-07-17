export interface UIState {
  modals: {
    [key: string]: {
      isOpen: boolean;
      data?: any;
    };
  };
  notifications: Notification[];
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  loading: {
    [key: string]: boolean;
  };
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  timestamp: Date;
}

export interface ModalPayload {
  modalId: string;
  data?: any;
}

export interface NotificationPayload {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}
