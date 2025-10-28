import { diag, DiagConsoleLogger, DiagLogLevel, trace } from '@opentelemetry/api';
import { logs } from '@opentelemetry/api-logs';
import { Resource } from '@opentelemetry/resources';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { LoggerProvider, BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

export type TelemetryRuntime = {
  tracerProvider: WebTracerProvider;
  meterProvider: MeterProvider;
  loggerProvider: LoggerProvider;
};

const DEFAULT_ENDPOINT = 'http://localhost:4318';

type EndpointKind = 'traces' | 'metrics' | 'logs';

function buildUrl(kind: EndpointKind, base?: string) {
  const normalized = (base ?? DEFAULT_ENDPOINT).replace(/\/$/, '');
  if (normalized.endsWith(`/v1/${kind}`)) {
    return normalized;
  }
  return `${normalized}/v1/${kind}`;
}

function parseHeaders(raw?: string) {
  if (!raw) {
    return {} as Record<string, string>;
  }
  return raw.split(',').reduce((headers, entry) => {
    const [key, value] = entry.split('=');
    if (key && value) {
      headers[key.trim()] = value.trim();
    }
    return headers;
  }, {} as Record<string, string>);
}

function createResource() {
  return new Resource({
    'service.name': process.env.NEXT_PUBLIC_OTEL_SERVICE_NAME ?? 'bmad-web-app',
    'service.namespace': process.env.NEXT_PUBLIC_OTEL_SERVICE_NAMESPACE ?? 'bmad.platform',
    'deployment.environment': process.env.NEXT_PUBLIC_ENVIRONMENT ?? 'local',
  });
}

export async function initTelemetry(): Promise<TelemetryRuntime | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

  const baseEndpoint = process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT;
  const headers = parseHeaders(process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_HEADERS);
  const resource = createResource();

  const tracerProvider = new WebTracerProvider({ resource });
  tracerProvider.addSpanProcessor(
    new BatchSpanProcessor(
      new OTLPTraceExporter({ url: buildUrl('traces', baseEndpoint), headers })
    )
  );
  tracerProvider.register();

  const metricExporter = new OTLPMetricExporter({
    url: buildUrl('metrics', baseEndpoint),
    headers,
  });
  const meterProvider = new MeterProvider({
    resource,
    readers: [new PeriodicExportingMetricReader({ exporter: metricExporter })],
  });

  const loggerProvider = new LoggerProvider({ resource });
  loggerProvider.addLogRecordProcessor(
    new BatchLogRecordProcessor(
      new OTLPLogExporter({ url: buildUrl('logs', baseEndpoint), headers })
    )
  );
  logs.setGlobalLoggerProvider(loggerProvider);

  registerInstrumentations({
    tracerProvider,
    meterProvider,
    instrumentations: [
      new FetchInstrumentation({
        propagateTraceHeaderCorsUrls: [
          process.env.NEXT_PUBLIC_CORE_API_BASE_URL ?? 'http://localhost:8000',
        ],
      }),
    ],
  });

  const meter = meterProvider.getMeter('bmad.web');
  const counter = meter.createCounter('bmad_web_page_view_total', {
    description: 'Total de visualizações de página registradas na sessão',
  });
  counter.add(1, { route: window.location.pathname });

  const webLogger = loggerProvider.getLogger('bmad.web');
  webLogger.emit({
    severityText: 'INFO',
    body: 'page_view',
    attributes: {
      route: window.location.pathname,
      userAgent: window.navigator.userAgent,
    },
  });

  trace.getTracer('bmad.web').startSpan('telemetry.initialized').end();

  return { tracerProvider, meterProvider, loggerProvider };
}
