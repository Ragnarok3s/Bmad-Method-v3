"""Dependency wiring for the Billing gateway service."""

from __future__ import annotations

from fastapi import FastAPI, Request

from services.payments import PaymentGatewayService
from services.payments.gateways import InMemoryGatewayDriver

_STATE_KEY = "gateway_service"


def configure_gateway_service(
    app: FastAPI,
    *,
    service: PaymentGatewayService | None = None,
) -> PaymentGatewayService:
    """Register the gateway service on the FastAPI application state."""

    if service is None:
        service = PaymentGatewayService()
        service.register_driver(InMemoryGatewayDriver("sandbox", webhook_secret="whsec_sandbox"))
    setattr(app.state, _STATE_KEY, service)
    return service


def get_gateway_service(request: Request) -> PaymentGatewayService:
    service = getattr(request.app.state, _STATE_KEY, None)
    if service is None:
        raise RuntimeError("Gateway service not configured")
    return service
