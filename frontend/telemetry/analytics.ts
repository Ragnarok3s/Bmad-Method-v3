import { Attributes, SpanStatusCode, context } from '@opentelemetry/api';

import type { TelemetryRuntime } from './init';

export type AnalyticsSpanHandle = {
  end: (status: 'success' | 'error', attributes?: Attributes) => void;
};

export type AnalyticsTelemetry = {
  startSpan: (name: string, attributes?: Attributes) => AnalyticsSpanHandle | null;
  recordFetch: (durationMs: number, attributes: Attributes) => void;
};

let runtimeInstrumentation: AnalyticsTelemetry | null = null;

export function registerAnalyticsInstrumentation(runtime: TelemetryRuntime) {
  const tracer = runtime.tracerProvider.getTracer('bmad.web.analytics');
  const meter = runtime.meterProvider.getMeter('bmad.web.analytics');
  const histogram = meter.createHistogram('bmad_web_analytics_fetch_duration_ms', {
    description: 'Tempo de resposta das consultas do dashboard de analytics',
    unit: 'ms'
  });

  runtimeInstrumentation = {
    startSpan: (name: string, attributes?: Attributes) => {
      const span = tracer.startSpan(name, { attributes }, context.active());
      return {
        end: (status, extra) => {
          span.setStatus({ code: status === 'success' ? SpanStatusCode.OK : SpanStatusCode.ERROR });
          if (extra) {
            Object.entries(extra).forEach(([key, value]) => {
              span.setAttribute(key, value as never);
            });
          }
          span.end();
        }
      };
    },
    recordFetch: (durationMs: number, attributes: Attributes) => {
      histogram.record(durationMs, attributes);
    }
  };

  if (typeof window !== 'undefined') {
    (window as typeof window & { __bmadAnalyticsTelemetry?: AnalyticsTelemetry }).__bmadAnalyticsTelemetry =
      runtimeInstrumentation;
  }
}

export function getAnalyticsTelemetry(): AnalyticsTelemetry | null {
  if (runtimeInstrumentation) {
    return runtimeInstrumentation;
  }
  if (typeof window === 'undefined') {
    return null;
  }
  return (window as typeof window & { __bmadAnalyticsTelemetry?: AnalyticsTelemetry }).__bmadAnalyticsTelemetry ?? null;
}
