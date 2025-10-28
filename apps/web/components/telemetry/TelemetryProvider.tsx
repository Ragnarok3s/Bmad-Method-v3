'use client';

import { useEffect } from 'react';

let configured = false;

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (configured) {
      return;
    }
    configured = true;
    void import('@/telemetry/init').then((module) => {
      module.initTelemetry();
    });
  }, []);

  return <>{children}</>;
}
