"""FastAPI application factory for the Billing gateway."""

from __future__ import annotations

from fastapi import FastAPI

from services.payments import PaymentGatewayService

from .dependencies import configure_gateway_service
from .routes import router


def create_app(*, service: PaymentGatewayService | None = None) -> FastAPI:
    app = FastAPI(title="Billing Gateway API", version="1.0.0")
    configure_gateway_service(app, service=service)
    app.include_router(router)
    return app


__all__ = ["create_app"]
