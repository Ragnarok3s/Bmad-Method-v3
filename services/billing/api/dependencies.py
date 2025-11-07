"""Dependency wiring for the Billing gateway service."""

from __future__ import annotations

import logging
import os

from fastapi import FastAPI, Request

from services.payments import DriverNotRegisteredError, PaymentGatewayService
from services.payments.gateways import InMemoryGatewayDriver

_STATE_KEY = "gateway_service"
_REAL_GATEWAY_FLAG = "BILLING_GATEWAY_ENABLE_REAL"
_SANDBOX_ALIAS_ENV = "BILLING_GATEWAY_SANDBOX_ALIAS"
_SANDBOX_SECRET_ENV = "BILLING_GATEWAY_SANDBOX_WEBHOOK_SECRET"

logger = logging.getLogger(__name__)


def _flag_enabled(value: str | None) -> bool:
    if not value:
        return False
    return value.lower() in {"1", "true", "yes", "on"}


def real_gateway_enabled() -> bool:
    """Expose whether the real PSP integration should be active."""

    return _flag_enabled(os.getenv(_REAL_GATEWAY_FLAG))


def _register_mock_gateway(service: PaymentGatewayService) -> None:
    alias = os.getenv(_SANDBOX_ALIAS_ENV, "sandbox")
    secret = os.getenv(_SANDBOX_SECRET_ENV, "whsec_sandbox")
    try:
        service.require_driver(alias)
    except DriverNotRegisteredError:
        service.register_driver(InMemoryGatewayDriver(alias, webhook_secret=secret))
        logger.info(
            "Billing gateway configured with mock driver '%s' (real PSP disabled)",
            alias,
        )


def configure_gateway_service(
    app: FastAPI,
    *,
    service: PaymentGatewayService | None = None,
) -> PaymentGatewayService:
    """Register the gateway service on the FastAPI application state."""

    if service is None:
        service = PaymentGatewayService()

    if not real_gateway_enabled():
        _register_mock_gateway(service)
    else:  # pragma: no cover - guarded for future real PSP integration
        logger.warning(
            "Real payment gateway flag enabled but no concrete driver is registered."
        )

    setattr(app.state, _STATE_KEY, service)
    return service


def get_gateway_service(request: Request) -> PaymentGatewayService:
    service = getattr(request.app.state, _STATE_KEY, None)
    if service is None:
        raise RuntimeError("Gateway service not configured")
    return service
