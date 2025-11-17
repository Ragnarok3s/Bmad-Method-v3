from datetime import datetime, timedelta, timezone

from services.core.config import CoreSettings
from services.core.database import Database
from services.core.domain.models import Base, Tenant
from services.core.domain.schemas import PropertyCreate, ReservationCreate
from services.core.services import PropertyService, ReservationService


def setup_database(db_url: str) -> Database:
    settings = CoreSettings(database_url=db_url)
    database = Database(settings)
    database.create_all(Base)
    return database


def test_reservation_email_masking(tmp_path) -> None:
    db_url = f"sqlite:///{tmp_path}/unit_privacy.db"
    database = setup_database(db_url)
    tenant_slug = "privacy"
    with database.session_scope() as session:
        tenant = Tenant(slug=tenant_slug, name="Tenant Privacidade", active=True)
        session.add(tenant)
        session.flush()
        tenant_id = tenant.id
        session.info["tenant_scope"] = "tenant"
        session.info["tenant_id"] = tenant_id
        session.info["tenant_slug"] = tenant.slug

        property_service = PropertyService(session)
        property_obj = property_service.create(
            PropertyCreate(name="Hotel Central", timezone="UTC", units=10)
        )
        reservation_service = ReservationService(session)
        reservation_service.create(
            ReservationCreate(
                property_id=property_obj.id,
                guest_name="Maria Silva",
                guest_email="maria@example.com",
                check_in=datetime.now(timezone.utc),
                check_out=datetime.now(timezone.utc) + timedelta(days=2),
            )
        )

    property_id = property_obj.id

    with database.session_scope() as session:
        session.info["tenant_scope"] = "tenant"
        session.info["tenant_id"] = tenant_id
        session.info["tenant_slug"] = tenant_slug
        reservation_service = ReservationService(session)
        reservations = reservation_service.list_for_property(property_id)
        assert reservations[0].guest_email.endswith("@example.test")
