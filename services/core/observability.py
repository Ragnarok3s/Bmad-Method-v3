"""Configuração centralizada de OpenTelemetry para a API core."""
from __future__ import annotations

import logging
import os
from typing import Any

from opentelemetry import metrics, trace
from opentelemetry._logs import set_logger_provider
from opentelemetry.exporter.otlp.proto.grpc._log_exporter import OTLPLogExporter
from opentelemetry.exporter.otlp.proto.grpc.metric_exporter import OTLPMetricExporter
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader
from opentelemetry.sdk.resources import OTELResourceDetector, Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

from .config import ObservabilitySettings


_CONFIGURED = False


def _build_resource(settings: ObservabilitySettings) -> Resource:
    detectors = [OTELResourceDetector()]  # inclui host.id/hostname quando disponível
    resource = Resource.create({
        "service.name": settings.service_name,
        "service.namespace": settings.service_namespace,
        "deployment.environment": settings.deployment_environment,
        "service.instance.id": os.environ.get("HOSTNAME", "local"),
    })
    for detector in detectors:
        resource = resource.merge(detector.detect())
    return resource


def _exporter_kwargs(settings: ObservabilitySettings) -> dict[str, Any]:
    kwargs: dict[str, Any] = {
        "endpoint": settings.otlp_endpoint,
        "insecure": settings.insecure,
    }
    if settings.otlp_headers:
        kwargs["headers"] = settings.otlp_headers
    return kwargs


def configure_observability(settings: ObservabilitySettings) -> None:
    """Inicializa providers de métricas, traces e logs para o serviço."""

    global _CONFIGURED
    if _CONFIGURED:
        return

    resource = _build_resource(settings)
    exporter_args = _exporter_kwargs(settings)

    if settings.enable_traces:
        tracer_provider = TracerProvider(resource=resource)
        tracer_provider.add_span_processor(
            BatchSpanProcessor(OTLPSpanExporter(**exporter_args))
        )
        trace.set_tracer_provider(tracer_provider)

    if settings.enable_metrics:
        metric_exporter = OTLPMetricExporter(**exporter_args)
        reader = PeriodicExportingMetricReader(metric_exporter)
        meter_provider = MeterProvider(resource=resource, metric_readers=[reader])
        metrics.set_meter_provider(meter_provider)

    if settings.enable_logs:
        logger_provider = LoggerProvider(resource=resource)
        logger_provider.add_log_record_processor(
            BatchLogRecordProcessor(OTLPLogExporter(**exporter_args))
        )
        set_logger_provider(logger_provider)
        handler = LoggingHandler(level=logging.INFO, logger_provider=logger_provider)
        root_logger = logging.getLogger()
        root_logger.addHandler(handler)
        if root_logger.level == logging.NOTSET:
            root_logger.setLevel(logging.INFO)

    _CONFIGURED = True


def instrument_application(app) -> None:
    """Aplica instrumentação automática do FastAPI quando disponível."""

    try:
        FastAPIInstrumentor.instrument_app(app)
    except Exception:
        logging.getLogger(__name__).exception("Falha ao instrumentar FastAPI")
