'use client';

import { Suspense } from 'react';
import { AnalyticsProvider } from '@/components/analytics/AnalyticsContext';
import { OfflineProvider } from '@/components/offline/OfflineContext';
import { GuidedTourProvider } from '@/components/tour/TourContext';
import { TelemetryProvider } from '@/components/telemetry/TelemetryProvider';
import { I18nProvider, useTranslation } from '@/lib/i18n';
import { TenantProvider } from '@/lib/tenant-context';

function NavigationFallback() {
  const { t } = useTranslation('common.loading');
  return <span className="sr-only">{t('navigation')}</span>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <Suspense fallback={<NavigationFallback />}>
        <TelemetryProvider>
          <TenantProvider>
            <AnalyticsProvider>
              <OfflineProvider>
                <GuidedTourProvider>{children}</GuidedTourProvider>
              </OfflineProvider>
            </AnalyticsProvider>
          </TenantProvider>
        </TelemetryProvider>
      </Suspense>
    </I18nProvider>
  );
}
