import logging
from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient
from opentelemetry import trace

from services.core.config import CoreSettings, TenantSettings
from services.core.main import build_application
from services.core.metrics import record_dashboard_request


pytestmark = pytest.mark.integration


@pytest.fixture(scope="module")
def client() -> Iterator[TestClient]:
    settings = CoreSettings(tenancy=TenantSettings(platform_token="platform-secret"))
    app = build_application(settings)
    with TestClient(app, headers={"x-tenant-slug": settings.tenancy.default_slug}) as test_client:
        yield test_client


def test_otel_health_endpoint_reports_activity(client: TestClient) -> None:
    """Smoke test que garante ingestão OTEL e health-check disponível."""

    record_dashboard_request("overview", True)
    logging.getLogger("tests.observability").info("smoke-log-event")

    tracer = trace.get_tracer(__name__)
    with tracer.start_as_current_span("observability-smoke-span"):
        pass

    response = client.get("/health/otel")
    assert response.status_code == 200

    payload = response.json()
    assert payload["ready"] is True
    assert payload["status"] in {"ok", "warming"}

    signals = payload["signals"]
    for signal_name in ("metrics", "logs", "traces"):
        signal = signals[signal_name]
        if signal["expected"]:
            assert signal["configured"] is True
            last_event = signal["last_event"]
            assert last_event is not None
            assert last_event["observed_at"] is not None

    collector = payload["collector"]
    assert collector["endpoint"].startswith("http")
