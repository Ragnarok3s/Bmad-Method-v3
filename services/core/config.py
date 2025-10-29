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


def _to_optional_int(value: str | None, default: int | None) -> int | None:
    if value is None or value.strip() == "":
        return default
    try:
        parsed = int(value)
    except ValueError:
        return default
    return None if parsed <= 0 else parsed


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
class PaymentGatewaySettings:
    """Configura integrações de PSP como Stripe ou Adyen."""

    provider: str = "stripe"
    api_key: str = ""
    merchant_account: str | None = None
    webhook_secret: str | None = None
    reconciliation_hour_utc: int = 2
    sla_threshold_seconds: int = 300
    allow_tokenization: bool = True

    @classmethod
    def from_environ(cls, environ: dict[str, str]) -> "PaymentGatewaySettings":
        provider = environ.get("CORE_PAYMENTS_PROVIDER", cls.provider)
        api_key = environ.get("CORE_PAYMENTS_API_KEY", "")
        merchant_account = environ.get("CORE_PAYMENTS_MERCHANT_ACCOUNT")
        webhook_secret = environ.get("CORE_PAYMENTS_WEBHOOK_SECRET")
        reconciliation_hour = _to_int(
            environ.get("CORE_PAYMENTS_RECONCILIATION_HOUR"), cls.reconciliation_hour_utc
        )
        sla_threshold = _to_int(
            environ.get("CORE_PAYMENTS_SLA_THRESHOLD_SECONDS"), cls.sla_threshold_seconds
        )
        allow_tokenization = _to_bool(
            environ.get("CORE_PAYMENTS_ALLOW_TOKENIZATION"), cls.allow_tokenization
        )
        return cls(
            provider=provider.lower(),
            api_key=api_key,
            merchant_account=merchant_account,
            webhook_secret=webhook_secret,
            reconciliation_hour_utc=max(0, min(reconciliation_hour, 23)),
            sla_threshold_seconds=max(60, sla_threshold),
            allow_tokenization=allow_tokenization,
        )


@dataclass(slots=True)
class CoreSettings:
    """Agrupa as configurações necessárias para a API core."""

    database_url: str = "sqlite:///./core.db"
    allowed_origins: List[str] | None = None
    enable_graphql: bool = True
    observability: ObservabilitySettings = field(default_factory=ObservabilitySettings)
    auth_session_timeout_seconds: int = 30 * 60
    payments: PaymentGatewaySettings = field(default_factory=PaymentGatewaySettings)
    tenancy: "TenantSettings" = field(default_factory=lambda: TenantSettings())

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
            payments=PaymentGatewaySettings.from_environ(environ),
            tenancy=TenantSettings.from_environ(environ),
        )


@dataclass(slots=True)
class TenantLimitSettings:
    max_workspaces: int | None = 5
    max_properties: int | None = 50
    max_agents: int | None = 200
    max_storage_mb: int | None = 10_240
    api_rate_per_minute: int | None = 600

    @classmethod
    def from_environ(cls, environ: dict[str, str]) -> "TenantLimitSettings":
        return cls(
            max_workspaces=_to_optional_int(
                environ.get("CORE_TENANCY_LIMIT_WORKSPACES"), cls.max_workspaces
            ),
            max_properties=_to_optional_int(
                environ.get("CORE_TENANCY_LIMIT_PROPERTIES"), cls.max_properties
            ),
            max_agents=_to_optional_int(
                environ.get("CORE_TENANCY_LIMIT_AGENTS"), cls.max_agents
            ),
            max_storage_mb=_to_optional_int(
                environ.get("CORE_TENANCY_LIMIT_STORAGE_MB"), cls.max_storage_mb
            ),
            api_rate_per_minute=_to_optional_int(
                environ.get("CORE_TENANCY_LIMIT_API_RATE_PER_MINUTE"),
                cls.api_rate_per_minute,
            ),
        )


@dataclass(slots=True)
class TenantSettings:
    default_slug: str = "pilot"
    default_name: str = "Tenant Piloto"
    default_plan: str = "trial"
    platform_token: str | None = None
    default_limits: TenantLimitSettings = field(default_factory=TenantLimitSettings)

    @classmethod
    def from_environ(cls, environ: dict[str, str]) -> "TenantSettings":
        return cls(
            default_slug=environ.get("CORE_TENANCY_DEFAULT_SLUG", cls.default_slug),
            default_name=environ.get("CORE_TENANCY_DEFAULT_NAME", cls.default_name),
            default_plan=environ.get("CORE_TENANCY_DEFAULT_PLAN", cls.default_plan),
            platform_token=environ.get("CORE_TENANCY_PLATFORM_TOKEN"),
            default_limits=TenantLimitSettings.from_environ(environ),
        )
