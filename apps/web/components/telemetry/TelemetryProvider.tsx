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
        console.info(
          '[Telemetry] Telemetria não será inicializada (desativada ou indisponível no ambiente atual).'
        );
        return;
      }
      const { registerAnalyticsInstrumentation } = await import('@/telemetry/analytics');
      registerAnalyticsInstrumentation(runtime);
    });
  }, []);

  return <>{children}</>;
}
