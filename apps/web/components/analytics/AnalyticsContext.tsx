'use client';

import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

type AnalyticsEvent = {
  type: string;
  payload?: Record<string, unknown>;
  timestamp: number;
};

interface AnalyticsContextValue {
  track: (type: AnalyticsEvent['type'], payload?: AnalyticsEvent['payload']) => void;
  flushQueue: () => AnalyticsEvent[];
}

const AnalyticsContext = createContext<AnalyticsContextValue | undefined>(undefined);

const ANALYTICS_KEY = 'bmad-analytics-queue';

function persistQueue(queue: AnalyticsEvent[]) {
  try {
    window.sessionStorage.setItem(ANALYTICS_KEY, JSON.stringify(queue));
  } catch {
    // ignore storage errors in private mode
  }
}

function loadQueue(): AnalyticsEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.sessionStorage.getItem(ANALYTICS_KEY);
    return stored ? (JSON.parse(stored) as AnalyticsEvent[]) : [];
  } catch {
    return [];
  }
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const queueRef = useRef<AnalyticsEvent[]>([]);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    queueRef.current = loadQueue();
  }, []);

  useEffect(() => {
    const event: AnalyticsEvent = {
      type: 'page_view',
      payload: {
        path: pathname,
        search: searchParams?.toString() ?? ''
      },
      timestamp: Date.now()
    };
    queueRef.current.push(event);
    persistQueue(queueRef.current);
  }, [pathname, searchParams]);

  const value = useMemo<AnalyticsContextValue>(() => ({
    track: (type, payload) => {
      const event: AnalyticsEvent = { type, payload, timestamp: Date.now() };
      queueRef.current.push(event);
      persistQueue(queueRef.current);
    },
    flushQueue: () => {
      const copy = [...queueRef.current];
      queueRef.current = [];
      persistQueue(queueRef.current);
      return copy;
    }
  }), []);

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
}

export function useAnalytics() {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) {
    throw new Error('useAnalytics deve ser utilizado dentro de AnalyticsProvider');
  }
  return ctx;
}
