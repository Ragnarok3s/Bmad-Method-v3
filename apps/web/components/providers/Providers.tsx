'use client';

import { Suspense } from 'react';
import { AnalyticsProvider } from '@/components/analytics/AnalyticsContext';
import { OfflineProvider } from '@/components/offline/OfflineContext';
import { GuidedTourProvider } from '@/components/tour/TourContext';
import { TelemetryProvider } from '@/components/telemetry/TelemetryProvider';
import { I18nProvider, useTranslation } from '@/lib/i18n';

function NavigationFallback() {
  const { t } = useTranslation('common.loading');
  return <span className="sr-only">{t('navigation')}</span>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <Suspense fallback={<NavigationFallback />}>
        <TelemetryProvider>
          <AnalyticsProvider>
            <OfflineProvider>
              <GuidedTourProvider>{children}</GuidedTourProvider>
            </OfflineProvider>
          </AnalyticsProvider>
        </TelemetryProvider>
      </Suspense>
    </I18nProvider>
  );
}
