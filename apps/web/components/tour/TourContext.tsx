'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type TourStep = {
  id: string;
  title: string;
  description: string;
  target?: string;
};

interface TourContextValue {
  isOpen: boolean;
  currentIndex: number;
  steps: TourStep[];
  open: () => void;
  close: () => void;
  next: () => void;
  previous: () => void;
  registerSteps: (steps: TourStep[]) => void;
}

const TourContext = createContext<TourContextValue | undefined>(undefined);

export function GuidedTourProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [steps, setSteps] = useState<TourStep[]>([]);

  const open = useCallback(() => {
    setIsOpen(true);
    setCurrentIndex(0);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((index) => Math.min(index + 1, steps.length - 1));
  }, [steps.length]);

  const previous = useCallback(() => {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  }, []);

  const registerSteps = useCallback((tourSteps: TourStep[]) => {
    setSteps(tourSteps);
  }, []);

  const value = useMemo<TourContextValue>(() => ({
    isOpen,
    currentIndex,
    steps,
    open,
    close,
    next,
    previous,
    registerSteps
  }), [close, currentIndex, isOpen, next, open, previous, registerSteps, steps]);

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
}

export function useGuidedTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useGuidedTour deve ser usado dentro de GuidedTourProvider');
  }
  return context;
}
