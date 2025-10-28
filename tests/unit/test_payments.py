from datetime import datetime, timedelta, timezone

import pytest

from services.core.config import CoreSettings, PaymentGatewaySettings
from services.core.database import Database
from services.core.domain.models import (
    Base,
    InvoiceStatus,
    PaymentIntentStatus,
    PaymentProvider,
    ReservationStatus,
)
from services.core.domain.schemas import (
    PaymentAuthorizationRequest,
    PaymentMethodCreate,
    PropertyCreate,
    ReservationCreate,
    ReservationUpdateStatus,
)
from services.core.payments import PaymentService
from services.core.services import PropertyService, ReservationService


def setup_database(db_url: str, provider: str = "stripe") -> tuple[Database, PaymentGatewaySettings]:
    settings = CoreSettings(database_url=db_url, payments=PaymentGatewaySettings(provider=provider))
    database = Database(settings)
    database.create_all(Base)
    return database, settings.payments


@pytest.mark.payments
def test_reservation_payment_lifecycle(tmp_path) -> None:
    db_url = f"sqlite:///{tmp_path}/payments.db"
    database, payment_settings = setup_database(db_url)
    with database.session_scope() as session:
        property_service = PropertyService(session)
        property_obj = property_service.create(
            PropertyCreate(name="Hotel Atlântico", timezone="UTC", units=5)
        )
        payment_service = PaymentService(session, payment_settings)
        reservation_service = ReservationService(session, payment_service=payment_service)
        payment_payload = PaymentAuthorizationRequest(
            method=PaymentMethodCreate(
                provider=PaymentProvider(payment_settings.provider),
                customer_reference="guest-001",
                payment_method_nonce="nonce-abc123",
            ),
            amount_minor=45000,
            currency="brl",
            capture_on_check_in=True,
        )
        reservation = reservation_service.create(
            ReservationCreate(
                property_id=property_obj.id,
                guest_name="João Pereira",
                guest_email="joao@example.com",
                check_in=datetime.now(timezone.utc),
                check_out=datetime.now(timezone.utc) + timedelta(days=3),
                payment=payment_payload,
            )
        )
        assert reservation.payment_intents
        assert reservation.payment_intents[0].status == PaymentIntentStatus.PREAUTHORIZED
        assert reservation.capture_on_check_in is True
        assert reservation.currency_code == "BRL"

        updated = reservation_service.update_status(
            reservation.id,
            ReservationUpdateStatus(status=ReservationStatus.CHECKED_IN),
        )
        session.refresh(updated)
        assert updated.payment_intents[0].status == PaymentIntentStatus.CAPTURED
        assert updated.invoices
        assert updated.invoices[0].status == InvoiceStatus.ISSUED
        assert updated.capture_on_check_in is False
