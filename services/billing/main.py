"""Entrypoint for running the Billing gateway service."""

from __future__ import annotations

from fastapi import FastAPI

from services.billing.api import create_app


def build_application() -> FastAPI:
    return create_app()


app = build_application()


__all__ = ["app", "build_application"]
