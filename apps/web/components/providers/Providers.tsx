'use client';

import { Suspense, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

export function Providers({
  children,
  initialLocale
}: {
  children: React.ReactNode;
  initialLocale?: string;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 60_000
          },
          mutations: {
            retry: 1
          }
        }
      })
  );

  return (
    <I18nProvider initialLocale={initialLocale}>
      <Suspense fallback={<NavigationFallback />}>
        <TelemetryProvider>
          <QueryClientProvider client={queryClient}>
            <TenantProvider>
              <AnalyticsProvider>
                <OfflineProvider>
                  <GuidedTourProvider>{children}</GuidedTourProvider>
                </OfflineProvider>
              </AnalyticsProvider>
            </TenantProvider>
          </QueryClientProvider>
        </TelemetryProvider>
      </Suspense>
    </I18nProvider>
  );
}
