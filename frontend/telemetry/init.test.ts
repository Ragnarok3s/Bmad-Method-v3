import type { TelemetryRuntime } from './init';

const spanEndMock = jest.fn();
const startSpanMock = jest.fn(() => ({ end: spanEndMock }));

const traceGetTracerMock = jest.fn(() => ({ startSpan: startSpanMock }));
const diagSetLoggerMock = jest.fn();
const createContextKeyMock = jest.fn(() => Symbol('contextKey'));
const contextActiveMock = jest.fn(() => ({}));

jest.mock('@opentelemetry/api', () => ({
  diag: { setLogger: diagSetLoggerMock },
  DiagConsoleLogger: class {},
  DiagLogLevel: { ERROR: 'ERROR' },
  trace: { getTracer: traceGetTracerMock },
  createContextKey: createContextKeyMock,
  context: { active: contextActiveMock },
}));

const registerInstrumentationsMock = jest.fn();

jest.mock('@opentelemetry/instrumentation', () => ({
  registerInstrumentations: registerInstrumentationsMock,
}));

const fetchInstrumentationMock = jest.fn();

jest.mock('@opentelemetry/instrumentation-fetch', () => ({
  FetchInstrumentation: fetchInstrumentationMock,
}));

const tracerProviderMock = {
  addSpanProcessor: jest.fn(),
  register: jest.fn(),
};

jest.mock('@opentelemetry/sdk-trace-web', () => ({
  WebTracerProvider: jest.fn(() => tracerProviderMock),
}));

const meterCounterAddMock = jest.fn();
const meterMock = {
  createCounter: jest.fn(() => ({ add: meterCounterAddMock })),
};
const meterProviderMock = {
  getMeter: jest.fn(() => meterMock),
};

jest.mock('@opentelemetry/sdk-metrics', () => ({
  MeterProvider: jest.fn(() => meterProviderMock),
  PeriodicExportingMetricReader: jest.fn(function PeriodicExportingMetricReader() {}),
}));

const loggerEmitMock = jest.fn();
const loggerProviderMock = {
  addLogRecordProcessor: jest.fn(),
  getLogger: jest.fn(() => ({ emit: loggerEmitMock })),
};

jest.mock('@opentelemetry/sdk-logs', () => ({
  LoggerProvider: jest.fn(() => loggerProviderMock),
  BatchLogRecordProcessor: jest.fn(function BatchLogRecordProcessor() {}),
}));

const setGlobalLoggerProviderMock = jest.fn();

jest.mock('@opentelemetry/api-logs', () => ({
  logs: { setGlobalLoggerProvider: setGlobalLoggerProviderMock },
}));

jest.mock('@opentelemetry/exporter-trace-otlp-http', () => ({
  OTLPTraceExporter: jest.fn(),
}));

jest.mock('@opentelemetry/exporter-metrics-otlp-http', () => ({
  OTLPMetricExporter: jest.fn(),
}));

jest.mock('@opentelemetry/exporter-logs-otlp-http', () => ({
  OTLPLogExporter: jest.fn(),
}));

jest.mock('@opentelemetry/sdk-trace-base', () => ({
  BatchSpanProcessor: jest.fn(function BatchSpanProcessor() {}),
}));

let initTelemetry: () => Promise<TelemetryRuntime | null>;

beforeAll(async () => {
  ({ initTelemetry } = await import('./init'));
});

const originalEnv = process.env;

beforeEach(() => {
  jest.clearAllMocks();
  process.env = { ...originalEnv };
  delete process.env.NEXT_PUBLIC_ENABLE_TELEMETRY;
  delete process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT;
  delete process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_HEADERS;
  traceGetTracerMock.mockClear();
  startSpanMock.mockClear();
  spanEndMock.mockClear();
  diagSetLoggerMock.mockClear();
  registerInstrumentationsMock.mockClear();
  fetchInstrumentationMock.mockClear();
  tracerProviderMock.addSpanProcessor.mockClear();
  tracerProviderMock.register.mockClear();
  meterCounterAddMock.mockClear();
  meterMock.createCounter.mockClear();
  meterProviderMock.getMeter.mockClear();
  loggerEmitMock.mockClear();
  loggerProviderMock.addLogRecordProcessor.mockClear();
  setGlobalLoggerProviderMock.mockClear();
});

afterAll(() => {
  process.env = originalEnv;
});

describe('initTelemetry', () => {
  it('retorna null e loga mensagem quando desativada via flag', async () => {
    process.env.NEXT_PUBLIC_ENABLE_TELEMETRY = 'false';
    const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});

    const runtime = await initTelemetry();

    expect(runtime).toBeNull();
    expect(infoSpy).toHaveBeenCalledWith(
      expect.stringContaining('Telemetria desativada via NEXT_PUBLIC_ENABLE_TELEMETRY')
    );
    expect(tracerProviderMock.register).not.toHaveBeenCalled();
    expect(registerInstrumentationsMock).not.toHaveBeenCalled();
    expect(traceGetTracerMock).not.toHaveBeenCalled();
    expect(diagSetLoggerMock).toHaveBeenCalledWith(expect.anything(), 'ERROR');
    expect(setGlobalLoggerProviderMock).not.toHaveBeenCalled();

    infoSpy.mockRestore();
  });

  it('registra instrumentação local quando endpoint não é definido', async () => {
    const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});

    const runtime = await initTelemetry();

    expect(runtime).not.toBeNull();
    expect(infoSpy).toHaveBeenCalledWith(
      expect.stringContaining('NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT não definido')
    );

    const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-http');
    const { OTLPMetricExporter } = await import('@opentelemetry/exporter-metrics-otlp-http');
    const { OTLPLogExporter } = await import('@opentelemetry/exporter-logs-otlp-http');
    const { BatchSpanProcessor } = await import('@opentelemetry/sdk-trace-base');
    const { PeriodicExportingMetricReader } = await import('@opentelemetry/sdk-metrics');
    const { BatchLogRecordProcessor } = await import('@opentelemetry/sdk-logs');

    expect((OTLPTraceExporter as jest.Mock).mock.calls).toHaveLength(0);
    expect((BatchSpanProcessor as jest.Mock).mock.calls).toHaveLength(0);
    expect((OTLPMetricExporter as jest.Mock).mock.calls).toHaveLength(0);
    expect((PeriodicExportingMetricReader as jest.Mock).mock.calls).toHaveLength(0);
    expect((OTLPLogExporter as jest.Mock).mock.calls).toHaveLength(0);
    expect((BatchLogRecordProcessor as jest.Mock).mock.calls).toHaveLength(0);
    expect(loggerProviderMock.addLogRecordProcessor).not.toHaveBeenCalled();

    expect(registerInstrumentationsMock).toHaveBeenCalled();
    expect(fetchInstrumentationMock).toHaveBeenCalledTimes(1);
    expect(fetchInstrumentationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        propagateTraceHeaderCorsUrls: ['http://localhost:8000'],
      })
    );
    expect(meterProviderMock.getMeter).toHaveBeenCalledWith('bmad.web');
    expect(meterMock.createCounter).toHaveBeenCalledWith(
      'bmad_web_page_view_total',
      expect.objectContaining({ description: expect.any(String) })
    );
    expect(meterCounterAddMock).toHaveBeenCalledWith(1, {
      route: window.location.pathname,
    });
    expect(loggerEmitMock).toHaveBeenCalledWith(
      expect.objectContaining({
        body: 'page_view',
        attributes: expect.objectContaining({ route: window.location.pathname }),
      })
    );
    expect(setGlobalLoggerProviderMock).toHaveBeenCalledWith(loggerProviderMock);
    expect(traceGetTracerMock).toHaveBeenCalledWith('bmad.web');
    expect(startSpanMock).toHaveBeenCalledWith('telemetry.initialized');
    expect(spanEndMock).toHaveBeenCalled();
    expect(diagSetLoggerMock).toHaveBeenCalledWith(expect.anything(), 'ERROR');

    infoSpy.mockRestore();
  });

  it('configura exportadores quando endpoint é fornecido', async () => {
    process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT = 'https://collector.example.com';
    process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_HEADERS = 'Authorization=Bearer token123';

    await initTelemetry();

    const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-http');
    const { OTLPMetricExporter } = await import('@opentelemetry/exporter-metrics-otlp-http');
    const { OTLPLogExporter } = await import('@opentelemetry/exporter-logs-otlp-http');
    const { BatchSpanProcessor } = await import('@opentelemetry/sdk-trace-base');
    const { PeriodicExportingMetricReader } = await import('@opentelemetry/sdk-metrics');
    const { BatchLogRecordProcessor } = await import('@opentelemetry/sdk-logs');

    expect((OTLPTraceExporter as jest.Mock).mock.calls[0][0]).toEqual({
      url: 'https://collector.example.com/v1/traces',
      headers: { Authorization: 'Bearer token123' },
    });
    expect((BatchSpanProcessor as jest.Mock).mock.calls).toHaveLength(1);
    expect((OTLPMetricExporter as jest.Mock).mock.calls[0][0]).toEqual({
      url: 'https://collector.example.com/v1/metrics',
      headers: { Authorization: 'Bearer token123' },
    });
    expect((PeriodicExportingMetricReader as jest.Mock).mock.calls).toHaveLength(1);
    expect((OTLPLogExporter as jest.Mock).mock.calls[0][0]).toEqual({
      url: 'https://collector.example.com/v1/logs',
      headers: { Authorization: 'Bearer token123' },
    });
    expect((BatchLogRecordProcessor as jest.Mock).mock.calls).toHaveLength(1);
    expect(loggerProviderMock.addLogRecordProcessor).toHaveBeenCalledTimes(1);
    expect(fetchInstrumentationMock).toHaveBeenCalledTimes(1);
    expect(fetchInstrumentationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        propagateTraceHeaderCorsUrls: ['http://localhost:8000'],
      })
    );
    expect(traceGetTracerMock).toHaveBeenCalledWith('bmad.web');
    expect(startSpanMock).toHaveBeenCalledWith('telemetry.initialized');
    expect(spanEndMock).toHaveBeenCalled();
    expect(diagSetLoggerMock).toHaveBeenCalledWith(expect.anything(), 'ERROR');
  });
});
