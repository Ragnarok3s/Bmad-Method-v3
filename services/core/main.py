"""Aplicação FastAPI principal com GraphQL opcional."""
from __future__ import annotations

from fastapi import FastAPI

from .api.graphql import create_graphql_router

from .api.rest import create_app
from .analytics import KafkaStream, KafkaStreamConfig
from .config import CoreSettings
from .database import get_database
from .domain.models import Base
from .observability import configure_observability
from .tenancy import create_tenant_manager
from .services.bundles import BundleUsageService


def build_application(settings: CoreSettings | None = None) -> FastAPI:
    settings = settings or CoreSettings()
    configure_observability(settings.observability)
    database = get_database(settings)
    database.create_all(Base)

    stream_settings = settings.analytics.bundle_usage_stream
    if stream_settings.enabled:
        stream_config = KafkaStreamConfig(
            bootstrap_servers=stream_settings.bootstrap_servers,
            topic=stream_settings.topic,
            group_id=stream_settings.group_id,
            batch_size=stream_settings.batch_size,
            poll_timeout=stream_settings.poll_timeout,
            partitions=stream_settings.partitions,
        )
        BundleUsageService.attach_stream(KafkaStream(stream_config))
    else:
        BundleUsageService.attach_stream(None)

    tenant_manager = create_tenant_manager(settings, database)
    app = create_app(settings, database=database, tenant_manager=tenant_manager)
    if settings.enable_graphql:
        graphql_app = create_graphql_router(database, tenant_manager=tenant_manager)
        app.include_router(graphql_app, prefix="/graphql")
    return app


app = build_application()
