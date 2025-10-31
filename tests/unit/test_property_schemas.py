from datetime import datetime, timezone

from services.core.domain.schemas import ReservationRead, ReconciliationQueueRead
from services.core.domain.models import ReservationStatus, ReconciliationSource, ReconciliationStatus
from services.property.schemas import (
    PropertyCalendarResponse,
    PropertyInventoryReconciliationResponse,
)


def _build_reservation(reservation_id: int, property_id: int) -> ReservationRead:
    now = datetime(2024, 1, 1, tzinfo=timezone.utc)
    return ReservationRead(
        id=reservation_id,
        property_id=property_id,
        guest_name="Test Guest",
        guest_email="guest@example.com",
        status=ReservationStatus.CONFIRMED,
        check_in=now,
        check_out=now,
        total_amount_minor=None,
        currency_code=None,
        capture_on_check_in=False,
        created_at=now,
        payment_intents=[],
        invoices=[],
    )


def _build_reconciliation(item_id: int, property_id: int) -> ReconciliationQueueRead:
    now = datetime(2024, 1, 1, tzinfo=timezone.utc)
    return ReconciliationQueueRead(
        id=item_id,
        property_id=property_id,
        reservation_id=None,
        channel_id=10,
        external_booking_id="ABCD1234",
        source=ReconciliationSource.OTA,
        status=ReconciliationStatus.PENDING,
        attempts=0,
        next_action_at=None,
        last_attempt_at=None,
        created_at=now,
        updated_at=now,
        sla_version_id=None,
        payload={"reason": "missing_mapping"},
    )


def test_property_calendar_response_counts() -> None:
    reservation = _build_reservation(1, 42)
    reconciliation = _build_reconciliation(5, 42)

    response = PropertyCalendarResponse(
        property_id=42,
        reservations=[reservation],
        reconciliation_items=[reconciliation],
    )

    assert response.reservations_count == 1
    assert response.reconciliation_count == 1
    assert response.generated_at.tzinfo == timezone.utc


def test_property_inventory_reconciliation_response_counts() -> None:
    items = [_build_reconciliation(1, 21), _build_reconciliation(2, 21)]

    response = PropertyInventoryReconciliationResponse(
        property_id=21,
        items=items,
    )

    assert response.pending_count == 2
    assert response.generated_at.tzinfo == timezone.utc
