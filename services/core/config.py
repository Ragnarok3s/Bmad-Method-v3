"""Configurações principais para o serviço core."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List


def _to_bool(value: str | None, default: bool = True) -> bool:
    if value is None:
        return default
    return value.lower() in {"1", "true", "yes", "on"}


def _parse_headers(value: str | None) -> Dict[str, str]:
    headers: Dict[str, str] = {}
    if not value:
        return headers
    for item in value.split(","):
        if "=" not in item:
            continue
        key, header_value = item.split("=", 1)
        key = key.strip()
        header_value = header_value.strip()
        if key:
            headers[key] = header_value
    return headers


def _split(value: str | None) -> List[str]:
    if not value:
        return []
    return [item.strip() for item in value.split(",") if item.strip()]


def _to_int(value: str | None, default: int) -> int:
    if value is None:
        return default
    try:
        return int(value)
    except ValueError:
        return default


@dataclass(slots=True)
class ObservabilitySettings:
    """Configurações para exporters OpenTelemetry."""

    service_name: str = "bmad-core-service"
    service_namespace: str = "bmad.platform"
    deployment_environment: str = "local"
    otlp_endpoint: str = "http://localhost:4317"
    otlp_headers: Dict[str, str] = field(default_factory=dict)
    insecure: bool = True
    enable_traces: bool = True
    enable_metrics: bool = True
    enable_logs: bool = True

    @classmethod
    def from_environ(cls, environ: dict[str, str]) -> "ObservabilitySettings":
        """Constroi configurações de observabilidade a partir das variáveis."""

        return cls(
            service_name=environ.get("CORE_OTEL_SERVICE_NAME", cls.service_name),
            service_namespace=environ.get(
                "CORE_OTEL_SERVICE_NAMESPACE", cls.service_namespace
            ),
            deployment_environment=environ.get(
                "CORE_DEPLOYMENT_ENVIRONMENT", cls.deployment_environment
            ),
            otlp_endpoint=environ.get(
                "CORE_OTEL_EXPORTER_OTLP_ENDPOINT", cls.otlp_endpoint
            ),
            otlp_headers=_parse_headers(
                environ.get("CORE_OTEL_EXPORTER_OTLP_HEADERS")
            ),
            insecure=_to_bool(environ.get("CORE_OTEL_EXPORTER_OTLP_INSECURE"), True),
            enable_traces=_to_bool(environ.get("CORE_OTEL_TRACES_ENABLED"), True),
            enable_metrics=_to_bool(environ.get("CORE_OTEL_METRICS_ENABLED"), True),
            enable_logs=_to_bool(environ.get("CORE_OTEL_LOGS_ENABLED"), True),
        )


@dataclass(slots=True)
class CoreSettings:
    """Agrupa as configurações necessárias para a API core."""

    database_url: str = "sqlite:///./core.db"
    allowed_origins: List[str] | None = None
    enable_graphql: bool = True
    observability: ObservabilitySettings = field(default_factory=ObservabilitySettings)
    auth_session_timeout_seconds: int = 30 * 60

    @classmethod
    def from_environ(cls, environ: dict[str, str]) -> "CoreSettings":
        """Cria configurações a partir de variáveis de ambiente."""

        return cls(
            database_url=environ.get("CORE_DATABASE_URL", "sqlite:///./core.db"),
            allowed_origins=_split(environ.get("CORE_ALLOWED_ORIGINS")),
            enable_graphql=_to_bool(environ.get("CORE_ENABLE_GRAPHQL"), True),
            observability=ObservabilitySettings.from_environ(environ),
            auth_session_timeout_seconds=_to_int(
                environ.get("CORE_AUTH_SESSION_TIMEOUT_SECONDS"),
                30 * 60,
            ),
        )
