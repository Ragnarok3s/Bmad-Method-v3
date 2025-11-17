(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/Bmad-Method/apps/web/telemetry/init.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "initTelemetry",
    ()=>initTelemetry
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/@opentelemetry/api/build/esm/diag-api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$consoleLogger$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/@opentelemetry/api/build/esm/diag/consoleLogger.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/@opentelemetry/api/build/esm/diag/types.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2d$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/@opentelemetry/api/build/esm/trace-api.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/@opentelemetry/api-logs/build/esm/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$ResourceImpl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/@opentelemetry/resources/build/esm/ResourceImpl.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$autoLoader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/@opentelemetry/instrumentation/build/esm/autoLoader.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2d$fetch$2f$build$2f$esm$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/@opentelemetry/instrumentation-fetch/build/esm/fetch.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$LoggerProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/@opentelemetry/sdk-logs/build/esm/LoggerProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$platform$2f$browser$2f$export$2f$BatchLogRecordProcessor$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/@opentelemetry/sdk-logs/build/esm/platform/browser/export/BatchLogRecordProcessor.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$logs$2d$otlp$2d$http$2f$build$2f$esm$2f$platform$2f$browser$2f$OTLPLogExporter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/@opentelemetry/exporter-logs-otlp-http/build/esm/platform/browser/OTLPLogExporter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$MeterProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/@opentelemetry/sdk-metrics/build/esm/MeterProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$PeriodicExportingMetricReader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/@opentelemetry/sdk-metrics/build/esm/export/PeriodicExportingMetricReader.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$metrics$2d$otlp$2d$http$2f$build$2f$esm$2f$platform$2f$browser$2f$OTLPMetricExporter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/@opentelemetry/exporter-metrics-otlp-http/build/esm/platform/browser/OTLPMetricExporter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$trace$2d$web$2f$build$2f$esm$2f$WebTracerProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/@opentelemetry/sdk-trace-web/build/esm/WebTracerProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$trace$2d$base$2f$build$2f$esm$2f$platform$2f$browser$2f$export$2f$BatchSpanProcessor$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/@opentelemetry/sdk-trace-base/build/esm/platform/browser/export/BatchSpanProcessor.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$trace$2d$otlp$2d$http$2f$build$2f$esm$2f$platform$2f$browser$2f$OTLPTraceExporter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Bmad-Method/node_modules/@opentelemetry/exporter-trace-otlp-http/build/esm/platform/browser/OTLPTraceExporter.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
function buildUrl(kind, base) {
    const normalized = base.replace(/\/$/, '');
    if (normalized.endsWith(`/v1/${kind}`)) {
        return normalized;
    }
    return `${normalized}/v1/${kind}`;
}
function isTelemetryDisabled(flag) {
    if (!flag) {
        return false;
    }
    const normalized = flag.trim().toLowerCase();
    return [
        '0',
        'false',
        'no',
        'off'
    ].includes(normalized);
}
function sanitizeEndpoint(raw) {
    const trimmed = raw?.trim();
    return trimmed ? trimmed : undefined;
}
function parseHeaders(raw) {
    if (!raw) {
        return {};
    }
    return raw.split(',').reduce((headers, entry)=>{
        const [key, value] = entry.split('=');
        if (key && value) {
            headers[key.trim()] = value.trim();
        }
        return headers;
    }, {});
}
function createResource() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$resources$2f$build$2f$esm$2f$ResourceImpl$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resourceFromAttributes"])({
        'service.name': ("TURBOPACK compile-time value", "bmad-web-app") ?? 'bmad-web-app',
        'service.namespace': ("TURBOPACK compile-time value", "bmad.platform") ?? 'bmad.platform',
        'deployment.environment': ("TURBOPACK compile-time value", "local") ?? 'local'
    });
}
async function initTelemetry() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2d$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["diag"].setLogger(new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$consoleLogger$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DiagConsoleLogger"](), __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$diag$2f$types$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DiagLogLevel"].ERROR);
    if (isTelemetryDisabled(("TURBOPACK compile-time value", "true"))) {
        console.info('[Telemetry] Telemetria desativada via NEXT_PUBLIC_ENABLE_TELEMETRY. Instrumentações não serão registradas.');
        return null;
    }
    const baseEndpoint = sanitizeEndpoint(("TURBOPACK compile-time value", ""));
    const headers = parseHeaders(("TURBOPACK compile-time value", ""));
    const resource = createResource();
    const tracerProvider = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$trace$2d$web$2f$build$2f$esm$2f$WebTracerProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WebTracerProvider"]({
        resource
    });
    if (baseEndpoint) {
        tracerProvider.addSpanProcessor(new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$trace$2d$base$2f$build$2f$esm$2f$platform$2f$browser$2f$export$2f$BatchSpanProcessor$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BatchSpanProcessor"](new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$trace$2d$otlp$2d$http$2f$build$2f$esm$2f$platform$2f$browser$2f$OTLPTraceExporter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OTLPTraceExporter"]({
            url: buildUrl('traces', baseEndpoint),
            headers
        })));
    } else {
        console.info('[Telemetry] NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT não definido; instrumentações serão registradas sem exportadores.');
    }
    tracerProvider.register();
    const meterProvider = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$MeterProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeterProvider"]({
        resource,
        readers: baseEndpoint ? [
            new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$metrics$2f$build$2f$esm$2f$export$2f$PeriodicExportingMetricReader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PeriodicExportingMetricReader"]({
                exporter: new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$metrics$2d$otlp$2d$http$2f$build$2f$esm$2f$platform$2f$browser$2f$OTLPMetricExporter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OTLPMetricExporter"]({
                    url: buildUrl('metrics', baseEndpoint),
                    headers
                })
            })
        ] : []
    });
    const loggerProvider = new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$LoggerProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LoggerProvider"]({
        resource
    });
    if (baseEndpoint) {
        loggerProvider.addLogRecordProcessor(new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$sdk$2d$logs$2f$build$2f$esm$2f$platform$2f$browser$2f$export$2f$BatchLogRecordProcessor$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BatchLogRecordProcessor"](new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$exporter$2d$logs$2d$otlp$2d$http$2f$build$2f$esm$2f$platform$2f$browser$2f$OTLPLogExporter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OTLPLogExporter"]({
            url: buildUrl('logs', baseEndpoint),
            headers
        })));
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$api$2d$logs$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["logs"].setGlobalLoggerProvider(loggerProvider);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2f$build$2f$esm$2f$autoLoader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerInstrumentations"])({
        tracerProvider,
        meterProvider,
        instrumentations: [
            new __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$instrumentation$2d$fetch$2f$build$2f$esm$2f$fetch$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FetchInstrumentation"]({
                propagateTraceHeaderCorsUrls: [
                    ("TURBOPACK compile-time value", "http://localhost:8000") ?? 'http://localhost:8000'
                ]
            })
        ]
    });
    const meter = meterProvider.getMeter('bmad.web');
    const counter = meter.createCounter('bmad_web_page_view_total', {
        description: 'Total de visualizações de página registradas na sessão'
    });
    counter.add(1, {
        route: window.location.pathname
    });
    const webLogger = loggerProvider.getLogger('bmad.web');
    webLogger.emit({
        severityText: 'INFO',
        body: 'page_view',
        attributes: {
            route: window.location.pathname,
            userAgent: window.navigator.userAgent
        }
    });
    __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Bmad$2d$Method$2f$node_modules$2f40$opentelemetry$2f$api$2f$build$2f$esm$2f$trace$2d$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trace"].getTracer('bmad.web').startSpan('telemetry.initialized').end();
    return {
        tracerProvider,
        meterProvider,
        loggerProvider
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_Bmad-Method_apps_web_telemetry_init_ts_373baca8._.js.map