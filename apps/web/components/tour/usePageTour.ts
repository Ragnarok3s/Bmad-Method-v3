'use client';

import { useEffect, useMemo } from 'react';

import type { TourRegistration } from './TourContext';
import { useGuidedTour } from './TourContext';

export function usePageTour(config: TourRegistration) {
  const { registerTour, startTour, hasCompleted } = useGuidedTour();

  const stepsKey = useMemo(() => JSON.stringify(config.steps), [config.steps]);
  const metadataKey = useMemo(() => JSON.stringify(config.metadata ?? {}), [config.metadata]);

  const registration = useMemo<TourRegistration>(
    () => ({
      id: config.id,
      title: config.title,
      description: config.description,
      route: config.route,
      autoStart: config.autoStart,
      metadata: config.metadata,
      steps: config.steps.map((step) => ({ ...step }))
    }),
    [config.autoStart, config.description, config.id, config.route, config.title, metadataKey, stepsKey]
  );

  useEffect(() => {
    return registerTour(registration);
  }, [registerTour, registration]);

  const completed = hasCompleted(config.id);

  return {
    start: () => startTour(config.id),
    completed
  };
}
