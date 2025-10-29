'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

const STORAGE_KEY = 'bmad-owner-token';
const DEFAULT_OWNER_ID = Number(process.env.NEXT_PUBLIC_OWNER_ID ?? '1');
const EXPECTED_TOKEN = process.env.NEXT_PUBLIC_OWNER_TOKEN ?? 'demo-owner-token';

type OwnerAccessStatus = 'checking' | 'authenticated' | 'unauthenticated';

type OwnerAccessContextValue = {
  ownerId: number;
  token: string | null;
  status: OwnerAccessStatus;
  authenticate: (code: string) => boolean;
  logout: () => void;
};

const OwnerAccessContext = createContext<OwnerAccessContextValue | undefined>(undefined);

export function OwnerAccessProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<OwnerAccessStatus>('checking');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      setToken(stored);
      setStatus('authenticated');
    } else {
      setStatus('unauthenticated');
    }
  }, []);

  const authenticate = useCallback((code: string) => {
    if (code.trim() === EXPECTED_TOKEN) {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(STORAGE_KEY, code.trim());
      }
      setToken(code.trim());
      setStatus('authenticated');
      return true;
    }
    setStatus('unauthenticated');
    return false;
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
    setToken(null);
    setStatus('unauthenticated');
  }, []);

  const value = useMemo(
    () => ({ ownerId: DEFAULT_OWNER_ID, token, status, authenticate, logout }),
    [token, status, authenticate, logout]
  );

  return <OwnerAccessContext.Provider value={value}>{children}</OwnerAccessContext.Provider>;
}

export function useOwnerAccess(): OwnerAccessContextValue {
  const context = useContext(OwnerAccessContext);
  if (!context) {
    throw new Error('useOwnerAccess must be used within OwnerAccessProvider');
  }
  return context;
}
