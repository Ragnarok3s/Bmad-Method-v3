import pytest

from services.core.config import CoreSettings, TenantLimitSettings, TenantSettings
from services.core.database import Database
from services.core.domain.models import Base
from services.core.domain.schemas import PropertyCreate, WorkspaceCreate
from services.core.services import PropertyService, WorkspaceService
from services.core.tenancy import TenantLimitError, create_tenant_manager


def setup_database(tmp_path):
    settings = CoreSettings(
        database_url=f"sqlite:///{tmp_path}/tenancy.db",
        tenancy=TenantSettings(
            default_slug="pilot",
            default_name="Tenant Piloto",
            default_limits=TenantLimitSettings(max_workspaces=1, max_properties=2),
            platform_token="platform-secret",
        ),
    )
    database = Database(settings)
    database.create_all(Base)
    manager = create_tenant_manager(settings, database)
    return settings, database, manager


def build_workspace_payload(name: str) -> WorkspaceCreate:
    return WorkspaceCreate(
        name=name,
        timezone="UTC",
        team_size=4,
        primary_use_case="operations",
        communication_channel="slack",
        quarterly_goal="Garantir SLA",
        invite_emails=[],
        team_roles=["operations"],
        enable_sandbox=True,
        require_mfa=True,
    )


def build_property_payload(name: str) -> PropertyCreate:
    return PropertyCreate(
        name=name,
        timezone="UTC",
        address=None,
        units=3,
    )


def test_workspace_creation_respects_tenant_limits(tmp_path) -> None:
    settings, database, manager = setup_database(tmp_path)

    with database.session_scope() as session:
        tenant = manager.ensure_tenant(session, settings.tenancy.default_slug, settings.tenancy.default_name)
        manager.bind_session(session, tenant)
        service = WorkspaceService(session, tenant_manager=manager)

        workspace = service.create(build_workspace_payload("Operações"))
        assert workspace.tenant_id == tenant.id

        with pytest.raises(TenantLimitError):
            service.create(build_workspace_payload("Overflow"))


def test_property_listing_isolated_by_tenant(tmp_path) -> None:
    settings, database, manager = setup_database(tmp_path)

    with database.session_scope() as session:
        tenant_alpha = manager.ensure_tenant(session, "alpha", "Tenant Alpha")
        manager.bind_session(session, tenant_alpha)
        property_service = PropertyService(session, tenant_manager=manager)
        created = property_service.create(build_property_payload("Casa Central"))
        assert created.tenant_id == tenant_alpha.id

    with database.session_scope() as session:
        tenant_beta = manager.ensure_tenant(session, "beta", "Tenant Beta")
        manager.bind_session(session, tenant_beta)
        property_service = PropertyService(session, tenant_manager=manager)
        assert property_service.list() == []
        property_service.create(build_property_payload("Lago Azul"))
        assert len(property_service.list()) == 1


def test_platform_token_validation(tmp_path) -> None:
    settings, database, manager = setup_database(tmp_path)
    assert manager.validate_platform_token("platform-secret") is True
    assert manager.validate_platform_token("invalid") is False


def test_tenant_migrations_populate_observability(tmp_path) -> None:
    settings, database, manager = setup_database(tmp_path)

    with database.session_scope() as session:
        tenant = manager.ensure_tenant(session, settings.tenancy.default_slug, settings.tenancy.default_name)
        manager.bind_session(session, tenant)
        refreshed = session.get(type(tenant), tenant.id)
        assert refreshed is not None
        observability = refreshed.attributes.get("observability", {})
        assert observability.get("status") == "ready"
