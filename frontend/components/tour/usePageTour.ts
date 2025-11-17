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

  const routeKey = useMemo(() => {
    if (config.route === undefined) {
      return undefined;
    }
    return JSON.stringify(config.route);
  }, [config.route]);

  const route = useMemo<TourRegistration['route']>(() => {
    if (routeKey === undefined) {
      return undefined;
    }
    return JSON.parse(routeKey) as TourRegistration['route'];
  }, [routeKey]);

  const registration = useMemo<TourRegistration>(
    () => ({
      id: config.id,
      title: config.title,
      description: config.description,
      route,
      autoStart: config.autoStart,
      metadata,
      steps
    }),
    [config.autoStart, config.description, config.id, config.title, metadata, route, steps]
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
