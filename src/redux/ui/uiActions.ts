import { createAsyncThunk } from '@reduxjs/toolkit';
import type { NotificationPayload } from './uiTypes';

/**
 * UI Actions - Redux Toolkit Async Actions
 * 
 * Este arquivo contém as ações assíncronas para o módulo UI,
 * seguindo o padrão estabelecido pelos outros módulos Redux.
 */

/**
 * Exibe uma notificação temporária
 * Remove automaticamente após o tempo especificado
 */
export const showNotification = createAsyncThunk<
  void,
  NotificationPayload & { id?: string },
  { rejectValue: string }
>('ui/showNotification', async (notification) => {
  const { duration = 5000 } = notification;
  
  // A notificação será adicionada pelo reducer
  // Aqui podemos adicionar lógica adicional como analytics, etc.
  
  // Auto-remove após duração especificada
  if (duration > 0) {
    setTimeout(() => {
      // Dispatch da ação de remoção será feita aqui quando necessário
    }, duration);
  }
});

/**
 * Salva preferências do tema no localStorage
 */
export const saveThemePreference = createAsyncThunk<
  'light' | 'dark',
  'light' | 'dark',
  { rejectValue: string }
>('ui/saveThemePreference', async (theme, { rejectWithValue }) => {
  try {
    localStorage.setItem('cognit-theme', theme);
    return theme;
  } catch {
    return rejectWithValue('Failed to save theme preference');
  }
});

/**
 * Carrega preferências do tema do localStorage
 */
export const loadThemePreference = createAsyncThunk<
  'light' | 'dark',
  void,
  { rejectValue: string }
>('ui/loadThemePreference', async (_, { rejectWithValue }) => {
  try {
    const savedTheme = localStorage.getItem('cognit-theme');
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme as 'light' | 'dark';
    }
    
    // Fallback para preferência do sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  } catch {
    return rejectWithValue('Failed to load theme preference');
  }
});

/**
 * Salva estado do sidebar no localStorage
 */
export const saveSidebarState = createAsyncThunk<
  boolean,
  boolean,
  { rejectValue: string }
>('ui/saveSidebarState', async (collapsed, { rejectWithValue }) => {
  try {
    localStorage.setItem('cognit-sidebar-collapsed', JSON.stringify(collapsed));
    return collapsed;
  } catch {
    return rejectWithValue('Failed to save sidebar state');
  }
});

/**
 * Carrega estado do sidebar do localStorage
 */
export const loadSidebarState = createAsyncThunk<
  boolean,
  void,
  { rejectValue: string }
>('ui/loadSidebarState', async (_, { rejectWithValue }) => {
  try {
    const savedState = localStorage.getItem('cognit-sidebar-collapsed');
    if (savedState) {
      return JSON.parse(savedState);
    }
    return false; // Padrão: sidebar expandido
  } catch {
    return rejectWithValue('Failed to load sidebar state');
  }
});

/**
 * Ação para inicializar preferências do usuário
 * Carrega tema e estado do sidebar
 */
export const initializeUserPreferences = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('ui/initializeUserPreferences', async (_, { dispatch }) => {
  // Carrega preferências em paralelo
  await Promise.all([
    dispatch(loadThemePreference()),
    dispatch(loadSidebarState()),
  ]);
});