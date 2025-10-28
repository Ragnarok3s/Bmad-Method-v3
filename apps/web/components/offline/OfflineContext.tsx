'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

interface OfflineContextValue {
  isOffline: boolean;
  lastChangedAt: number | null;
  registerManualSync: (description: string) => void;
  pendingActions: string[];
}

const OfflineContext = createContext<OfflineContextValue | undefined>(undefined);

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOffline, setIsOffline] = useState<boolean>(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  const [lastChangedAt, setLastChangedAt] = useState<number | null>(null);
  const [pendingActions, setPendingActions] = useState<string[]>([]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setLastChangedAt(Date.now());
    };

    const handleOffline = () => {
      setIsOffline(true);
      setLastChangedAt(Date.now());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const registerManualSync = useCallback((description: string) => {
    setPendingActions((prev) => Array.from(new Set([...prev, description])));
  }, []);

  const value = useMemo<OfflineContextValue>(() => ({
    isOffline,
    lastChangedAt,
    registerManualSync,
    pendingActions
  }), [isOffline, lastChangedAt, registerManualSync, pendingActions]);

  return <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>;
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline deve ser usado dentro de OfflineProvider');
  }
  return context;
}
