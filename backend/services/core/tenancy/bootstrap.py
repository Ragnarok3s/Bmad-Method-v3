from __future__ import annotations

from ..config import CoreSettings
from ..database import Database
from .manager import TenantLimitProfile, TenantManager
from .migrations import get_default_migrations


def create_tenant_manager(settings: CoreSettings, database: Database) -> TenantManager:
    profile = TenantLimitProfile(
        max_workspaces=settings.tenancy.default_limits.max_workspaces,
        max_properties=settings.tenancy.default_limits.max_properties,
        max_agents=settings.tenancy.default_limits.max_agents,
        max_storage_mb=settings.tenancy.default_limits.max_storage_mb,
        api_rate_per_minute=settings.tenancy.default_limits.api_rate_per_minute,
    )
    manager = TenantManager(
        default_limits=profile,
        migrations=get_default_migrations(),
        platform_token=settings.tenancy.platform_token,
    )

    default_attributes = {
        "plan": settings.tenancy.default_plan,
        "provisioned_by": "core-bootstrap",
    }
    with database.session_scope() as session:
        manager.ensure_tenant(
            session,
            settings.tenancy.default_slug,
            settings.tenancy.default_name,
            attributes=default_attributes,
        )
    return manager
