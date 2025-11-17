"""Error helpers for the Billing gateway API."""

from __future__ import annotations

from fastapi import HTTPException, status

from services.payments import DriverNotRegisteredError


class GatewayOperationError(RuntimeError):
    """Wraps unexpected gateway failures so HTTP responses stay consistent."""


def map_exception(exc: Exception) -> HTTPException:
    """Translate domain exceptions into proper HTTP errors."""

    if isinstance(exc, DriverNotRegisteredError):
        return HTTPException(status.HTTP_404_NOT_FOUND, "Gateway não configurado")
    if isinstance(exc, ValueError):
        return HTTPException(status.HTTP_400_BAD_REQUEST, str(exc))
    if isinstance(exc, GatewayOperationError):
        return HTTPException(status.HTTP_502_BAD_GATEWAY, str(exc))
    return HTTPException(status.HTTP_502_BAD_GATEWAY, "Falha inesperada no gateway de pagamentos")
