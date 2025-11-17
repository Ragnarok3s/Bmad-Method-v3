"""Application factory for the identity service."""

from __future__ import annotations

from fastapi import FastAPI

from services.core.config import CoreSettings
from services.core.database import get_database
from services.core.domain.models import Base
from services.core.observability import configure_observability

from .api import create_app
from .models import TenantAgentAccess  # noqa: F401 - ensure metadata registration


def build_application(settings: CoreSettings | None = None) -> FastAPI:
    settings = settings or CoreSettings()
    observability = settings.observability
    if (
        observability.enable_traces
        or observability.enable_metrics
        or observability.enable_logs
    ):
        configure_observability(observability)
    database = get_database(settings)
    database.create_all(Base)
    return create_app(settings=settings, database=database)


app = build_application()


__all__ = ["app", "build_application"]
