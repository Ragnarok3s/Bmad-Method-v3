from __future__ import annotations

import os
import sys
from collections.abc import Iterator
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
  sys.path.insert(0, str(ROOT))

import pytest
from fastapi.testclient import TestClient

from services.core.config import CoreSettings, TenantSettings
from services.core.main import build_application

_REAL_GATEWAY_FLAG = "BILLING_GATEWAY_ENABLE_REAL"


def _flag_enabled(value: str | None) -> bool:
  if not value:
    return False
  return value.lower() in {"1", "true", "yes", "on"}


def is_real_gateway_enabled() -> bool:
  """Expose if automated suites should target the real payment PSP."""

  return _flag_enabled(os.getenv(_REAL_GATEWAY_FLAG))


@pytest.hookimpl(tryfirst=True)
def pytest_runtest_setup(item) -> None:
  if "real_gateway" in item.keywords and not is_real_gateway_enabled():
    pytest.skip(
        "cenário dependente do PSP real ignorado porque BILLING_GATEWAY_ENABLE_REAL está desligado"
    )


@pytest.fixture
def core_api_client(tmp_path) -> Iterator[TestClient]:
  """Cria um cliente configurado para acessar a API core com banco isolado."""

  database_path = tmp_path / "core-api-tests.db"
  settings = CoreSettings(
      database_url=f"sqlite:///{database_path}",
      enable_graphql=False,
      tenancy=TenantSettings(platform_token="test-platform-token"),
  )
  app = build_application(settings)

  with TestClient(app, headers={"x-tenant-slug": settings.tenancy.default_slug}) as client:
    yield client
