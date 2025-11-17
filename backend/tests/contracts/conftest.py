from __future__ import annotations

from pathlib import Path
from typing import Iterator

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from services.core.api.partners import router as marketplace_router


@pytest.fixture(scope="session")
def pact_directory() -> Path:
    directory = Path(__file__).parent / "pacts"
    directory.mkdir(parents=True, exist_ok=True)
    return directory


@pytest.fixture(scope="session")
def marketplace_app() -> FastAPI:
    app = FastAPI(title="Bmad Marketplace Contracts")
    app.include_router(marketplace_router)
    return app


@pytest.fixture(scope="session")
def marketplace_client(marketplace_app: FastAPI) -> Iterator[TestClient]:
    with TestClient(marketplace_app) as client:
        yield client
