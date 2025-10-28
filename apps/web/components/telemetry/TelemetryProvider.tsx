'use client';

import { useEffect } from 'react';

let configured = false;

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (configured) {
      return;
    }
    configured = true;
    void import('@/telemetry/init').then(async (module) => {
      const runtime = await module.initTelemetry();
      if (!runtime) {
        return;
      }
      const { registerAnalyticsInstrumentation } = await import('@/telemetry/analytics');
      registerAnalyticsInstrumentation(runtime);
    });
  }, []);

  return <>{children}</>;
}
