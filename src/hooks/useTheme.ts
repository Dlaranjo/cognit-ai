import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { setTheme } from '../redux/ui/uiReducer';
import { selectTheme } from '../redux/ui/uiSelectors';

type Theme = 'light' | 'dark';

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector(selectTheme);

  const toggleTheme = useCallback(() => {
    const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
    
    // Apply theme to document element
    applyThemeToDocument(newTheme);
  }, [currentTheme, dispatch]);

  const setThemeMode = useCallback((theme: Theme) => {
    dispatch(setTheme(theme));
    applyThemeToDocument(theme);
  }, [dispatch]);

  const getSystemTheme = useCallback((): Theme => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }, []);

  const setSystemTheme = useCallback(() => {
    const systemTheme = getSystemTheme();
    setThemeMode(systemTheme);
  }, [getSystemTheme, setThemeMode]);

  const isDark = currentTheme === 'dark';
  const isLight = currentTheme === 'light';

  return {
    theme: currentTheme,
    isDark,
    isLight,
    toggleTheme,
    setTheme: setThemeMode,
    setSystemTheme,
    getSystemTheme,
  };
};

// Helper function to apply theme to document
const applyThemeToDocument = (theme: Theme) => {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Store theme preference in localStorage
    localStorage.setItem('theme', theme);
  }
};

// Hook to initialize theme on app start
export const useThemeInitializer = () => {
  const { setTheme, getSystemTheme } = useTheme();

  const initializeTheme = useCallback(() => {
    // Check localStorage first
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    
    if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
      setTheme(storedTheme);
    } else {
      // Fallback to system preference
      const systemTheme = getSystemTheme();
      setTheme(systemTheme);
    }
  }, [setTheme, getSystemTheme]);

  return { initializeTheme };
};

// Hook to listen to system theme changes
export const useSystemThemeListener = () => {
  const { setTheme } = useTheme();

  const startListening = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        // Only update if user hasn't manually set a theme
        const storedTheme = localStorage.getItem('theme');
        if (!storedTheme) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      };

      mediaQuery.addEventListener('change', handleChange);

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [setTheme]);

  return { startListening };
};