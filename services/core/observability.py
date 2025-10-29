"""Configuração centralizada de OpenTelemetry para a API core."""
from __future__ import annotations

import logging
import os
from collections import Counter, deque
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Deque, Dict, Mapping

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
from opentelemetry.sdk.trace import ReadableSpan, TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

from .config import ObservabilitySettings


_MAX_AUDIT_EVENTS = 100
_MAX_ALERT_EVENTS = 100
_MAX_CONTROL_EVENTS = 200
_CONFIGURED = False


@dataclass
class _SignalState:
    expected: bool
    configured: bool = False
    exporter: str | None = None
    endpoint: str | None = None
    last_event_name: str | None = None
    last_event_attributes: Mapping[str, str] | None = None
    last_event_at: datetime | None = None


@dataclass
class _RuntimeState:
    resource: Mapping[str, Any] = field(default_factory=dict)
    collector_endpoint: str | None = None
    insecure: bool = True
    headers: tuple[str, ...] = ()
    signals: Dict[str, _SignalState] = field(
        default_factory=lambda: {
            "traces": _SignalState(expected=False),
            "metrics": _SignalState(expected=False),
            "logs": _SignalState(expected=False),
        }
    )
    audit_events: Deque["_AuditEvent"] = field(
        default_factory=lambda: deque(maxlen=_MAX_AUDIT_EVENTS)
    )
    alert_events: Deque["_AlertEvent"] = field(
        default_factory=lambda: deque(maxlen=_MAX_ALERT_EVENTS)
    )
    alert_totals: Counter = field(default_factory=Counter)
    control_events: Deque["_ControlCheckpoint"] = field(
        default_factory=lambda: deque(maxlen=_MAX_CONTROL_EVENTS)
    )


_STATE = _RuntimeState()
_AUDIT_LOGGER = logging.getLogger("bmad.core.audit")
_ALERT_LOGGER = logging.getLogger("bmad.core.alerts")


def _now() -> datetime:
    return datetime.now(tz=timezone.utc)


def _stringify_attributes(attributes: Mapping[str, Any] | None) -> Mapping[str, str]:
    if not attributes:
        return {}
    return {str(key): str(value) for key, value in attributes.items()}


@dataclass
class _AuditEvent:
    action: str
    actor_id: int | None
    detail: Mapping[str, str]
    severity: str
    observed_at: datetime


@dataclass
class _AlertEvent:
    kind: str
    message: str
    severity: str
    context: Mapping[str, str]
    observed_at: datetime


@dataclass
class _ControlCheckpoint:
    control_id: str
    status: str
    actor_id: int | None
    detail: Mapping[str, str]
    tags: Mapping[str, str]
    observed_at: datetime


def mark_signal_event(
    signal: str,
    name: str,
    attributes: Mapping[str, Any] | None = None,
) -> None:
    """Regista a última atividade conhecida para o sinal indicado."""

    state = _STATE.signals.get(signal)
    if not state or not state.expected:
        return
    state.last_event_name = name
    state.last_event_attributes = _stringify_attributes(attributes)
    state.last_event_at = _now()


def record_audit_event(
    action: str,
    *,
    actor_id: int | None = None,
    detail: Mapping[str, Any] | str | None = None,
    severity: str = "info",
) -> None:
    detail_map: Mapping[str, str]
    if isinstance(detail, Mapping):
        detail_map = _stringify_attributes(detail)
        detail_for_log: Any = {str(key): value for key, value in detail.items()}
    elif detail is None:
        detail_map = {}
        detail_for_log = None
    else:
        detail_map = {"detail": str(detail)}
        detail_for_log = str(detail)

    attributes = {
        "action": action,
        "actor_id": actor_id,
        "detail": detail_for_log,
        "severity": severity,
    }
    mark_signal_event("logs", f"audit:{action}", attributes)
    level = getattr(logging, severity.upper(), logging.INFO)
    _AUDIT_LOGGER.log(level, "audit_event", extra=attributes)

    event = _AuditEvent(
        action=action,
        actor_id=actor_id,
        detail=dict(detail_map),
        severity=severity,
        observed_at=_now(),
    )
    _STATE.audit_events.appendleft(event)


def record_critical_alert(
    name: str,
    message: str | None = None,
    *,
    detail: str | None = None,
    context: Mapping[str, Any] | None = None,
    severity: str = "critical",
) -> None:
    """Regista alerta crítico e sincroniza telemetria/AIOps."""

    severity = severity or "critical"
    detail_value = detail if detail is not None else message
    context_attributes = _stringify_attributes(context)

    attributes: dict[str, Any] = {"name": name, "severity": severity}
    if detail_value is not None:
        attributes["detail"] = detail_value
    if message is not None:
        attributes["message"] = message
    if context_attributes:
        attributes["context"] = context_attributes

    mark_signal_event("logs", f"alert:{name}", attributes)
    level = getattr(logging, severity.upper(), logging.ERROR)
    _ALERT_LOGGER.log(level, "critical_alert", extra=attributes)

    event = _AlertEvent(
        kind=name,
        message=message or detail_value or name,
        severity=severity,
        context=context_attributes,
        observed_at=_now(),
    )
    _STATE.alert_events.appendleft(event)
    _STATE.alert_totals[severity] += 1
    _STATE.alert_totals["total"] += 1


def get_signal_health_snapshot() -> Mapping[str, Mapping[str, Any]]:
    """Retorna o estado atual dos sinais instrumentados para consumo por AIOps."""

    snapshot: dict[str, dict[str, Any]] = {}
    for signal, state in _STATE.signals.items():
        last_event_at = state.last_event_at.isoformat() if state.last_event_at else None
        snapshot[signal] = {
            "expected": state.expected,
            "configured": state.configured,
            "exporter": state.exporter,
            "endpoint": state.endpoint,
            "last_event_name": state.last_event_name,
            "last_event_at": last_event_at,
            "last_event_attributes": dict(state.last_event_attributes or {}),
        }
    return snapshot


class _TelemetryLoggingHandler(LoggingHandler):
    """Envia logs via OTLP e regista atividade para health-check."""

    def emit(self, record: logging.LogRecord) -> None:  # noqa: D401
        mark_signal_event(
            "logs",
            record.name,
            {
                "level": record.levelname,
                "message": record.getMessage(),
            },
        )
        super().emit(record)


class _TelemetrySpanProcessor(BatchSpanProcessor):
    """Span processor que rastreia spans exportados via OTLP."""

    def on_end(self, span: ReadableSpan) -> None:  # noqa: D401
        mark_signal_event(
            "traces",
            span.name,
            {
                "span.kind": span.kind.name,
                "status": span.status.status_code.name,
            },
        )
        super().on_end(span)


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

    global _CONFIGURED, _STATE
    if _CONFIGURED:
        return

    resource = _build_resource(settings)
    exporter_args = _exporter_kwargs(settings)

    _STATE = _RuntimeState(
        resource={key: str(value) for key, value in resource.attributes.items()},
        collector_endpoint=settings.otlp_endpoint,
        insecure=settings.insecure,
        headers=tuple(sorted(settings.otlp_headers.keys())),
        signals={
            "traces": _SignalState(expected=settings.enable_traces),
            "metrics": _SignalState(expected=settings.enable_metrics),
            "logs": _SignalState(expected=settings.enable_logs),
        },
    )

    if settings.enable_traces:
        tracer_provider = TracerProvider(resource=resource)
        tracer_provider.add_span_processor(
            _TelemetrySpanProcessor(OTLPSpanExporter(**exporter_args))
        )
        trace.set_tracer_provider(tracer_provider)
        trace_provider_state = _STATE.signals["traces"]
        trace_provider_state.configured = True
        trace_provider_state.exporter = "otlp_grpc"
        trace_provider_state.endpoint = settings.otlp_endpoint

    if settings.enable_metrics:
        metric_exporter = OTLPMetricExporter(**exporter_args)
        reader = PeriodicExportingMetricReader(metric_exporter)
        meter_provider = MeterProvider(resource=resource, metric_readers=[reader])
        metrics.set_meter_provider(meter_provider)
        metric_state = _STATE.signals["metrics"]
        metric_state.configured = True
        metric_state.exporter = "otlp_grpc"
        metric_state.endpoint = settings.otlp_endpoint

    if settings.enable_logs:
        logger_provider = LoggerProvider(resource=resource)
        logger_provider.add_log_record_processor(
            BatchLogRecordProcessor(OTLPLogExporter(**exporter_args))
        )
        set_logger_provider(logger_provider)
        handler = _TelemetryLoggingHandler(
            level=logging.INFO, logger_provider=logger_provider
        )
        root_logger = logging.getLogger()
        root_logger.addHandler(handler)
        if root_logger.level == logging.NOTSET:
            root_logger.setLevel(logging.INFO)
        log_state = _STATE.signals["logs"]
        log_state.configured = True
        log_state.exporter = "otlp_grpc"
        log_state.endpoint = settings.otlp_endpoint

    _CONFIGURED = True

def register_control_checkpoint(
    control_id: str,
    *,
    status: str,
    actor_id: int | None = None,
    detail: Mapping[str, Any] | None = None,
    tags: Mapping[str, Any] | None = None,
) -> None:
    """Registra um checkpoint de controle para rastreabilidade de compliance."""

    payload = _ControlCheckpoint(
        control_id=control_id,
        status=status,
        actor_id=actor_id,
        detail=_stringify_attributes(detail),
        tags=_stringify_attributes(tags),
        observed_at=_now(),
    )
    _STATE.control_events.appendleft(payload)
    mark_signal_event(
        "logs",
        f"compliance:{control_id}",
        {
            "status": status,
            "actor_id": actor_id,
            **payload.detail,
            **{f"tag.{key}": value for key, value in payload.tags.items()},
        },
    )


def get_compliance_snapshot(limit: int = 50) -> dict[str, Any]:
    """Devolve resumo dos últimos checkpoints de controle de compliance."""

    events: list[dict[str, Any]] = []
    for event in list(_STATE.control_events)[:limit]:
        events.append(
            {
                "control_id": event.control_id,
                "status": event.status,
                "actor_id": event.actor_id,
                "detail": dict(event.detail),
                "tags": dict(event.tags),
                "observed_at": event.observed_at.isoformat().replace("+00:00", "Z"),
            }
        )
    totals: Counter[str] = Counter()
    for event in _STATE.control_events:
        totals[event.status] += 1
    return {"recent": events, "totals": dict(totals)}


def get_observability_status() -> dict[str, Any]:
    """Devolve snapshot da configuração OTEL (usado pelos health-checks)."""

    signals: Dict[str, dict[str, Any]] = {}
    ready = True
    active = True
    for name, state in _STATE.signals.items():
        last_event = None
        if state.last_event_name:
            last_event = {
                "name": state.last_event_name,
                "attributes": dict(state.last_event_attributes or {}),
                "observed_at": state.last_event_at.isoformat()
                if state.last_event_at
                else None,
            }
        expected_and_missing = state.expected and not state.configured
        expected_and_inactive = state.expected and not state.last_event_at
        ready = ready and not expected_and_missing
        active = active and not expected_and_inactive
        signals[name] = {
            "expected": state.expected,
            "configured": state.configured,
            "exporter": state.exporter,
            "endpoint": state.endpoint,
            "last_event": last_event,
        }

    recent_audit = [
        {
            "action": event.action,
            "actor_id": event.actor_id,
            "detail": dict(event.detail),
            "severity": event.severity,
            "observed_at": event.observed_at.isoformat().replace("+00:00", "Z"),
        }
        for event in list(_STATE.audit_events)[:20]
    ]

    grouped_alerts: dict[str, list[dict[str, Any]]] = {}
    for event in _STATE.alert_events:
        bucket = grouped_alerts.setdefault(event.severity, [])
        if len(bucket) >= 20:
            continue
        bucket.append(
            {
                "kind": event.kind,
                "message": event.message,
                "severity": event.severity,
                "context": dict(event.context),
                "observed_at": event.observed_at.isoformat().replace("+00:00", "Z"),
            }
        )

    alerts_snapshot: dict[str, Any] = {
        "total": int(_STATE.alert_totals.get("total", 0)),
        "by_severity": dict(_STATE.alert_totals),
        "critical": grouped_alerts.get("critical", []),
    }
    for severity, events in grouped_alerts.items():
        if severity == "critical":
            continue
        alerts_snapshot[severity] = events

    return {
        "configured": _CONFIGURED,
        "ready": ready,
        "active": active,
        "collector": {
            "endpoint": _STATE.collector_endpoint,
            "insecure": _STATE.insecure,
            "headers": list(_STATE.headers),
        },
        "resource": dict(_STATE.resource),
        "signals": signals,
        "audit": {
            "total": len(_STATE.audit_events),
            "recent": recent_audit,
        },
        "alerts": alerts_snapshot,
        "compliance": get_compliance_snapshot(limit=20),
    }


def instrument_application(app) -> None:
    """Aplica instrumentação automática do FastAPI quando disponível."""

    try:
        FastAPIInstrumentor.instrument_app(app)
    except Exception:
        logging.getLogger(__name__).exception("Falha ao instrumentar FastAPI")
