'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  hasExplicitPreference: boolean;
}

const STORAGE_KEY = 'bmad-theme-preference';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function applyThemeClass(theme: Theme) {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.dataset.theme = theme;
}

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [hasExplicitPreference, setHasExplicitPreference] = useState(false);
  const isMountedRef = useRef(false);
  const isTestEnv = process.env.NODE_ENV === 'test';

  useEffect(() => {
    if (isTestEnv) {
      isMountedRef.current = true;
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      setThemeState(stored);
      setHasExplicitPreference(true);
      applyThemeClass(stored);
    } else {
      const systemTheme = getSystemTheme();
      setThemeState(systemTheme);
      applyThemeClass(systemTheme);
    }

    isMountedRef.current = true;
  }, []);

  useEffect(() => {
    if (isTestEnv) {
      return;
    }

    if (!isMountedRef.current || typeof window === 'undefined') {
      return;
    }

    applyThemeClass(theme);

    if (hasExplicitPreference) {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [theme, hasExplicitPreference]);

  useEffect(() => {
    if (isTestEnv || typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (event: MediaQueryListEvent) => {
      if (!hasExplicitPreference) {
        setThemeState(event.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [hasExplicitPreference]);

  const contextValue = useMemo<ThemeContextValue>(() => {
    const setTheme = (next: Theme) => {
      setHasExplicitPreference(true);
      setThemeState(next);
    };

    const toggleTheme = () => {
      setHasExplicitPreference(true);
      setThemeState((current) => (current === 'light' ? 'dark' : 'light'));
    };

    return {
      theme,
      toggleTheme,
      setTheme,
      hasExplicitPreference
    };
  }, [theme, hasExplicitPreference]);

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
