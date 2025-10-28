"""Aplicação FastAPI principal com GraphQL opcional."""
from __future__ import annotations

from fastapi import FastAPI

from .api.graphql import create_graphql_router

from .api.rest import create_app
from .config import CoreSettings
from .database import get_database
from .domain.models import Base


def build_application(settings: CoreSettings | None = None) -> FastAPI:
    settings = settings or CoreSettings()
    database = get_database(settings)
    database.create_all(Base)

    app = create_app(settings, database=database)
    if settings.enable_graphql:
        graphql_app = create_graphql_router(database)
        app.include_router(graphql_app, prefix="/graphql")
    return app


app = build_application()
