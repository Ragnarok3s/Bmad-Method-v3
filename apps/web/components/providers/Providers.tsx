'use client';

import { Suspense } from 'react';
import { AnalyticsProvider } from '@/components/analytics/AnalyticsContext';
import { OfflineProvider } from '@/components/offline/OfflineContext';
import { GuidedTourProvider } from '@/components/tour/TourContext';
import { TelemetryProvider } from '@/components/telemetry/TelemetryProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<span className="sr-only">A preparar contexto de navegação…</span>}>
      <TelemetryProvider>
        <AnalyticsProvider>
          <OfflineProvider>
            <GuidedTourProvider>{children}</GuidedTourProvider>
          </OfflineProvider>
        </AnalyticsProvider>
      </TelemetryProvider>
    </Suspense>
  );
}
