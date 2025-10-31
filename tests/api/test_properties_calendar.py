from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

import pytest
from fastapi import HTTPException, status

from services.core.api import rest as rest_module
from services.core.domain.models import ReconciliationSource, ReconciliationStatus, ReservationStatus
from services.core.domain.schemas import ReconciliationQueueRead, ReservationRead


class ReservationServiceStub:
  def __init__(self) -> None:
    self.property_ids: list[int] = []
    self.response: list[Any] = []
    self.exception: HTTPException | None = None

  def list_for_property(self, property_id: int) -> list[Any]:
    self.property_ids.append(property_id)
    if self.exception:
      raise self.exception
    return self.response


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


@pytest.fixture
def reservation_service_stub(monkeypatch: pytest.MonkeyPatch) -> ReservationServiceStub:
  stub = ReservationServiceStub()
  monkeypatch.setattr(rest_module, "_get_reservation_service", lambda request, session: stub)
  return stub


@pytest.fixture
def inventory_service_stub(monkeypatch: pytest.MonkeyPatch) -> InventoryServiceStub:
  stub = InventoryServiceStub()
  monkeypatch.setattr(rest_module, "InventoryReconciliationService", lambda session: stub)
  return stub


def _build_reservation(property_id: int) -> ReservationRead:
  now = datetime.now(timezone.utc).replace(microsecond=0)
  return ReservationRead(
      id=10,
      property_id=property_id,
      guest_name="Alice",
      guest_email="alice@example.com",
      status=ReservationStatus.CONFIRMED,
      check_in=now + timedelta(days=1),
      check_out=now + timedelta(days=3),
      total_amount_minor=None,
      currency_code=None,
      capture_on_check_in=False,
      created_at=now,
      payment_intents=None,
      invoices=None,
  )


def _build_reconciliation_item(property_id: int) -> ReconciliationQueueRead:
  now = datetime.now(timezone.utc).replace(microsecond=0)
  return ReconciliationQueueRead(
      id=55,
      property_id=property_id,
      reservation_id=None,
      channel_id=99,
      external_booking_id="ABC123",
      source=ReconciliationSource.OTA,
      status=ReconciliationStatus.PENDING,
      attempts=2,
      next_action_at=None,
      last_attempt_at=None,
      created_at=now - timedelta(hours=2),
      updated_at=now - timedelta(hours=1),
      sla_version_id=None,
      payload={"reason": "availability_mismatch"},
  )


def test_get_property_calendar_success(
    core_api_client,
    reservation_service_stub: ReservationServiceStub,
    inventory_service_stub: InventoryServiceStub,
) -> None:
  property_id = 101
  reservation = _build_reservation(property_id)
  reconciliation_item = _build_reconciliation_item(property_id)

  reservation_service_stub.response = [reservation]
  inventory_service_stub.items = [object()]
  inventory_service_stub.read_models = [reconciliation_item]
  inventory_service_stub._read_index = 0

  response = core_api_client.get(f"/properties/{property_id}/calendar")

  assert response.status_code == status.HTTP_200_OK
  body = response.json()
  assert body["property_id"] == property_id
  assert body["reservations"] == [reservation.model_dump(mode="json")]
  assert body["reconciliation_items"] == [reconciliation_item.model_dump(mode="json")]
  assert body["reservations_count"] == 1
  assert body["reconciliation_count"] == 1
  assert "generated_at" in body
  assert reservation_service_stub.property_ids == [property_id]
  assert inventory_service_stub.property_ids == [property_id]


def test_get_property_calendar_returns_validation_error(
    core_api_client,
    reservation_service_stub: ReservationServiceStub,
    inventory_service_stub: InventoryServiceStub,
) -> None:
  property_id = 202
  reservation_service_stub.exception = HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Propriedade não encontrada",
  )

  response = core_api_client.get(f"/properties/{property_id}/calendar")

  assert response.status_code == status.HTTP_404_NOT_FOUND
  assert response.json() == {"detail": "Propriedade não encontrada"}
  assert inventory_service_stub.property_ids == []


def test_get_property_calendar_handles_downstream_failure(
    core_api_client,
    reservation_service_stub: ReservationServiceStub,
    inventory_service_stub: InventoryServiceStub,
) -> None:
  property_id = 303
  inventory_service_stub.exception = HTTPException(
      status_code=status.HTTP_502_BAD_GATEWAY,
      detail="Inventário indisponível",
  )

  response = core_api_client.get(f"/properties/{property_id}/calendar")

  assert response.status_code == status.HTTP_502_BAD_GATEWAY
  assert response.json() == {"detail": "Inventário indisponível"}
