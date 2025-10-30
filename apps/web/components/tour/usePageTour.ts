'use client';

import { useCallback, useEffect, useMemo } from 'react';

import type { TourRegistration } from './TourContext';
import { useGuidedTour } from './TourContext';

export function usePageTour(config: TourRegistration) {
  const { registerTour, startTour, hasCompleted } = useGuidedTour();

  const stepsKey = useMemo(() => JSON.stringify(config.steps), [config.steps]);
  const steps = useMemo<TourRegistration['steps']>(() => {
    return JSON.parse(stepsKey) as TourRegistration['steps'];
  }, [stepsKey]);

  const metadataKey = useMemo(() => {
    if (config.metadata === undefined) {
      return undefined;
    }
    return JSON.stringify(config.metadata);
  }, [config.metadata]);

  const metadata = useMemo<TourRegistration['metadata']>(() => {
    if (metadataKey === undefined) {
      return undefined;
    }
    return JSON.parse(metadataKey) as TourRegistration['metadata'];
  }, [metadataKey]);

  const registration = useMemo<TourRegistration>(
    () => ({
      id: config.id,
      title: config.title,
      description: config.description,
      route: config.route,
      autoStart: config.autoStart,
      metadata,
      steps
    }),
    [config.autoStart, config.description, config.id, config.route, config.title, metadata, steps]
  );

  useEffect(() => {
    return registerTour(registration);
  }, [registerTour, registration]);

  const start = useCallback(() => {
    startTour(config.id);
  }, [config.id, startTour]);

  const completed = hasCompleted(config.id);

  return {
    start,
    completed
  };
}
