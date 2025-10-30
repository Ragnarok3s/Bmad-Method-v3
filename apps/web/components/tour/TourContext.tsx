'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { usePathname } from 'next/navigation';

import { useAnalytics } from '@/components/analytics/AnalyticsContext';

export type TourStep = {
  id: string;
  title: string;
  description: string;
  target?: string;
};

export type TourRegistration = {
  id: string;
  title: string;
  description?: string;
  steps: TourStep[];
  route?: string | string[];
  autoStart?: boolean;
  metadata?: Record<string, string>;
};

interface TourContextValue {
  isOpen: boolean;
  currentIndex: number;
  steps: TourStep[];
  activeStep: TourStep | null;
  activeTourId: string | null;
  tours: TourRegistration[];
  open: (tourId?: string) => void;
  startTour: (tourId: string) => void;
  close: (options?: { markCompleted?: boolean }) => void;
  next: () => void;
  previous: () => void;
  registerTour: (registration: TourRegistration) => () => void;
  hasCompleted: (tourId: string) => boolean;
  markCompleted: (tourId: string) => void;
}

const COMPLETED_STORAGE_KEY = 'bmad:guided-tour:completed';

const TourContext = createContext<TourContextValue | undefined>(undefined);

function normalizeRoutes(route?: string | string[]): string[] {
  if (!route) {
    return [];
  }
  if (Array.isArray(route)) {
    return route;
  }
  return [route];
}

export function tourMatchesPath(route: string | string[] | undefined, pathname: string): boolean {
  const routes = normalizeRoutes(route);
  if (routes.length === 0) {
    return true;
  }
  return routes.some((entry) => {
    if (entry === '*') {
      return true;
    }
    if (entry.endsWith('*')) {
      const prefix = entry.slice(0, -1);
      return pathname.startsWith(prefix);
    }
    return pathname === entry;
  });
}

export function GuidedTourProvider({ children }: { children: React.ReactNode }) {
  const analytics = useAnalytics();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTourId, setActiveTourId] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<Record<string, TourRegistration>>({});
  const [completed, setCompleted] = useState<string[]>([]);
  const autoStartTriggeredRef = useRef(new Set<string>());

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const stored = window.localStorage.getItem(COMPLETED_STORAGE_KEY);
      if (!stored) {
        return;
      }
      const parsed = JSON.parse(stored) as unknown;
      if (Array.isArray(parsed)) {
        const sanitized = parsed.filter((item): item is string => typeof item === 'string');
        setCompleted(sanitized);
      }
    } catch (error) {
      console.warn('guided_tour_completed_read_failed', error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(completed));
    } catch (error) {
      console.warn('guided_tour_completed_write_failed', error);
    }
  }, [completed]);

  const completedSet = useMemo(() => new Set(completed), [completed]);

  const registerTour = useCallback((registration: TourRegistration) => {
    setRegistrations((previous) => {
      const current = previous[registration.id];
      if (current === registration) {
        return previous;
      }
      return { ...previous, [registration.id]: registration };
    });
    return () => {
      setRegistrations((previous) => {
        if (!(registration.id in previous)) {
          return previous;
        }
        const next = { ...previous };
        delete next[registration.id];
        return next;
      });
    };
  }, []);

  const markCompleted = useCallback(
    (tourId: string) => {
      setCompleted((previous) => {
        if (previous.includes(tourId)) {
          return previous;
        }
        const next = [...previous, tourId];
        return next;
      });

      const registration = registrations[tourId];
      analytics.track('tour.completed', {
        tourId,
        route: registration?.route ?? 'global',
        steps: registration?.steps.length ?? 0
      });
    },
    [analytics, registrations]
  );

  const startTour = useCallback(
    (tourId: string) => {
      const registration = registrations[tourId];
      if (!registration || registration.steps.length === 0) {
        return;
      }
      setActiveTourId(tourId);
      setCurrentIndex(0);
      setIsOpen(true);
      analytics.track('tour.started', {
        tourId,
        route: registration.route ?? 'global',
        autoStart: registration.autoStart ?? false
      });
    },
    [analytics, registrations]
  );

  const open = useCallback(
    (tourId?: string) => {
      if (tourId) {
        startTour(tourId);
        return;
      }
      const firstTour = Object.values(registrations)[0];
      if (firstTour) {
        startTour(firstTour.id);
      }
    },
    [registrations, startTour]
  );

  const close = useCallback(
    (options: { markCompleted?: boolean } = {}) => {
      const { markCompleted: shouldComplete = false } = options;
      const currentTourId = activeTourId;
      setIsOpen(false);
      setCurrentIndex(0);
      if (shouldComplete && currentTourId) {
        markCompleted(currentTourId);
      }
      analytics.track('tour.closed', {
        tourId: currentTourId,
        markedCompleted: shouldComplete
      });
      if (shouldComplete) {
        setActiveTourId(null);
      }
    },
    [activeTourId, analytics, markCompleted]
  );

  const next = useCallback(() => {
    if (!activeTourId) {
      return;
    }
    const registration = registrations[activeTourId];
    if (!registration) {
      return;
    }
    const lastIndex = registration.steps.length - 1;
    if (currentIndex >= lastIndex) {
      markCompleted(activeTourId);
      setIsOpen(false);
      setActiveTourId(null);
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex((index) => Math.min(index + 1, lastIndex));
  }, [activeTourId, currentIndex, markCompleted, registrations]);

  const previous = useCallback(() => {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  }, []);

  const hasCompleted = useCallback((tourId: string) => completedSet.has(tourId), [completedSet]);

  useEffect(() => {
    if (!pathname || isOpen) {
      return;
    }
    const registrationsList = Object.values(registrations);
    for (const registration of registrationsList) {
      if (!registration.autoStart) {
        continue;
      }
      if (!tourMatchesPath(registration.route, pathname)) {
        continue;
      }
      if (completedSet.has(registration.id)) {
        continue;
      }
      const key = `${registration.id}:${pathname}`;
      if (autoStartTriggeredRef.current.has(key)) {
        continue;
      }
      autoStartTriggeredRef.current.add(key);
      startTour(registration.id);
      break;
    }
  }, [completedSet, isOpen, pathname, registrations, startTour]);

  const activeTour = useMemo(() => {
    if (!activeTourId) {
      return null;
    }
    return registrations[activeTourId] ?? null;
  }, [activeTourId, registrations]);

  const steps = useMemo(() => {
    return activeTour?.steps ?? [];
  }, [activeTour]);

  const activeStep = steps[currentIndex] ?? null;
  const tours = useMemo(() => Object.values(registrations), [registrations]);

  const value = useMemo<TourContextValue>(
    () => ({
      isOpen,
      currentIndex,
      steps,
      activeStep,
      activeTourId,
      tours,
      open,
      startTour,
      close,
      next,
      previous,
      registerTour,
      hasCompleted,
      markCompleted
    }),
    [
      activeStep,
      activeTourId,
      close,
      currentIndex,
      hasCompleted,
      isOpen,
      markCompleted,
      next,
      open,
      previous,
      registerTour,
      startTour,
      steps,
      tours
    ]
  );

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export function useGuidedTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useGuidedTour deve ser usado dentro de GuidedTourProvider');
  }
  return context;
}
