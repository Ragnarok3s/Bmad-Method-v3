from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

import pytest
from fastapi import HTTPException, status

from services.core.api import rest as rest_module
from services.core.domain.models import ReconciliationSource, ReconciliationStatus
from services.core.domain.schemas import ReconciliationQueueRead


class InventoryServiceStub:
  def __init__(self) -> None:
    self.property_ids: list[int] = []
    self.items: list[Any] = []
    self.read_models: list[ReconciliationQueueRead] = []
    self.exception: HTTPException | None = None
    self._read_index = 0

  def list_conflicts(self, *, property_id: int) -> list[Any]:
    self.property_ids.append(property_id)
    if self.exception:
      raise self.exception
    return self.items

  def to_read_model(self, item: Any) -> ReconciliationQueueRead | Any:
    if self._read_index < len(self.read_models):
      model = self.read_models[self._read_index]
      self._read_index += 1
      return model
    return item


class PropertyAccessStub:
  def __init__(self) -> None:
    self.property_ids: list[int] = []
    self.exception: HTTPException | None = None

  def __call__(self, session: Any, request: Any, property_id: int) -> None:
    self.property_ids.append(property_id)
    if self.exception:
      raise self.exception


@pytest.fixture
def inventory_service_stub(monkeypatch: pytest.MonkeyPatch) -> InventoryServiceStub:
  stub = InventoryServiceStub()
  monkeypatch.setattr(rest_module, "InventoryReconciliationService", lambda session: stub)
  return stub


@pytest.fixture
def property_access_stub(monkeypatch: pytest.MonkeyPatch) -> PropertyAccessStub:
  stub = PropertyAccessStub()

  def _ensure_property_access(session: Any, request: Any, property_id: int) -> None:
    stub(session, request, property_id)

  monkeypatch.setattr(rest_module, "_ensure_property_access", _ensure_property_access)
  return stub


def _build_reconciliation_item(property_id: int) -> ReconciliationQueueRead:
  now = datetime.now(timezone.utc).replace(microsecond=0)
  return ReconciliationQueueRead(
      id=77,
      property_id=property_id,
      reservation_id=9001,
      channel_id=None,
      external_booking_id=None,
      source=ReconciliationSource.OTA,
      status=ReconciliationStatus.CONFLICT,
      attempts=3,
      next_action_at=now + timedelta(hours=4),
      last_attempt_at=now - timedelta(hours=1),
      created_at=now - timedelta(days=1),
      updated_at=now,
      sla_version_id=12,
      payload={"action": "manual_review"},
  )


def test_get_property_reconciliation_success(
    core_api_client,
    inventory_service_stub: InventoryServiceStub,
    property_access_stub: PropertyAccessStub,
) -> None:
  property_id = 404
  reconciliation_item = _build_reconciliation_item(property_id)

  inventory_service_stub.items = [object()]
  inventory_service_stub.read_models = [reconciliation_item]
  inventory_service_stub._read_index = 0

  response = core_api_client.get(f"/properties/{property_id}/inventory/reconciliation")

  assert response.status_code == status.HTTP_200_OK
  body = response.json()
  assert body["property_id"] == property_id
  assert body["items"] == [reconciliation_item.model_dump(mode="json")]
  assert body["pending_count"] == 1
  assert "generated_at" in body
  assert inventory_service_stub.property_ids == [property_id]
  assert property_access_stub.property_ids == [property_id]


def test_get_property_reconciliation_access_denied(
    core_api_client,
    inventory_service_stub: InventoryServiceStub,
    property_access_stub: PropertyAccessStub,
) -> None:
  property_id = 505
  property_access_stub.exception = HTTPException(
      status_code=status.HTTP_403_FORBIDDEN,
      detail="Acesso negado",
  )

  response = core_api_client.get(f"/properties/{property_id}/inventory/reconciliation")

  assert response.status_code == status.HTTP_403_FORBIDDEN
  assert response.json() == {"detail": "Acesso negado"}
  assert inventory_service_stub.property_ids == []


def test_get_property_reconciliation_handles_downstream_failure(
    core_api_client,
    inventory_service_stub: InventoryServiceStub,
    property_access_stub: PropertyAccessStub,
) -> None:
  property_id = 606
  inventory_service_stub.exception = HTTPException(
      status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
      detail="Serviço de reconciliação indisponível",
  )

  response = core_api_client.get(f"/properties/{property_id}/inventory/reconciliation")

  assert response.status_code == status.HTTP_503_SERVICE_UNAVAILABLE
  assert response.json() == {"detail": "Serviço de reconciliação indisponível"}
