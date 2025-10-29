from __future__ import annotations

from contextlib import contextmanager
from dataclasses import dataclass
from typing import Any, Callable, Iterable

import logging
import secrets

from sqlalchemy import Select, func, select
from sqlalchemy.orm import Session

from ..domain.models import (
    Property,
    Tenant,
    TenantLimit,
    TenantMigrationState,
    Workspace,
)

logger = logging.getLogger(__name__)


class TenantNotFoundError(Exception):
    """Raised when a tenant with the requested identifier does not exist."""


class TenantIsolationError(Exception):
    """Raised when attempting to access resources outside the active tenant scope."""


class TenantLimitError(Exception):
    """Raised when a tenant capacity limit would be exceeded."""

    def __init__(self, key: str, limit: int | None) -> None:
        super().__init__(f"Limite '{key}' excedido para o tenant")
        self.key = key
        self.limit = limit


@dataclass(frozen=True, slots=True)
class TenantLimitProfile:
    """Default capacity limits applied to tenants."""

    max_workspaces: int | None = 5
    max_properties: int | None = 50
    max_agents: int | None = 200
    max_storage_mb: int | None = 10_240
    api_rate_per_minute: int | None = 600

    def as_dict(self) -> dict[str, int | None]:
        return {
            "max_workspaces": self.max_workspaces,
            "max_properties": self.max_properties,
            "max_agents": self.max_agents,
            "max_storage_mb": self.max_storage_mb,
            "api_rate_per_minute": self.api_rate_per_minute,
        }


@dataclass(frozen=True, slots=True)
class TenantMigration:
    """Represents an idempotent migration to be applied for tenants."""

    name: str
    handler: Callable[[Session, Tenant], None]

    def apply(self, session: Session, tenant: Tenant) -> None:
        logger.debug("Applying tenant migration", extra={"tenant": tenant.slug, "migration": self.name})
        self.handler(session, tenant)


class TenantManager:
    """Coordinates tenant isolation, capacity limits and migrations."""

    def __init__(
        self,
        *,
        default_limits: TenantLimitProfile,
        migrations: Iterable[TenantMigration] = (),
        platform_token: str | None = None,
    ) -> None:
        self._default_limits = default_limits
        self._migrations = {migration.name: migration for migration in migrations}
        self._platform_token = platform_token

    # -- Tenant lifecycle -------------------------------------------------
    def ensure_tenant(
        self,
        session: Session,
        slug: str,
        name: str,
        *,
        limits: TenantLimitProfile | None = None,
        attributes: dict[str, Any] | None = None,
    ) -> Tenant:
        normalized = slug.strip().lower()
        statement = select(Tenant).where(Tenant.slug == normalized)
        tenant = session.execute(statement).scalar_one_or_none()
        if tenant:
            if not tenant.active:
                tenant.active = True
                session.add(tenant)
            return tenant

        tenant = Tenant(slug=normalized, name=name.strip(), active=True)
        if attributes:
            tenant.attributes = attributes
        session.add(tenant)
        session.flush()

        profile = limits or self._default_limits
        self._ensure_limits(session, tenant, profile)
        logger.info("tenant_created", extra={"tenant": tenant.slug})
        return tenant

    def require_tenant(self, session: Session, slug: str) -> Tenant:
        statement = select(Tenant).where(Tenant.slug == slug.strip().lower())
        tenant = session.execute(statement).scalar_one_or_none()
        if tenant is None:
            raise TenantNotFoundError(slug)
        if not tenant.active:
            raise TenantIsolationError(f"Tenant '{slug}' está desativado")
        return tenant

    def list_active_tenants(
        self, session: Session, *, slugs: Iterable[str] | None = None
    ) -> list[Tenant]:
        statement = select(Tenant).where(Tenant.active.is_(True)).order_by(Tenant.name)
        if slugs:
            normalized = [slug.strip().lower() for slug in slugs]
            statement = statement.where(Tenant.slug.in_(normalized))
        return list(session.execute(statement).scalars())

    # -- Session binding --------------------------------------------------
    def bind_session(self, session: Session, tenant: Tenant) -> None:
        session.info["tenant_scope"] = "tenant"
        session.info["tenant_id"] = tenant.id
        session.info["tenant_slug"] = tenant.slug
        self._ensure_limits(session, tenant, self._default_limits)
        self.apply_migrations(session, tenant)

    def bind_platform_session(self, session: Session) -> None:
        session.info["tenant_scope"] = "platform"
        session.info.pop("tenant_id", None)
        session.info.pop("tenant_slug", None)

    @contextmanager
    def use_tenant(self, session: Session, tenant: Tenant):
        previous_scope = session.info.get("tenant_scope")
        previous_id = session.info.get("tenant_id")
        previous_slug = session.info.get("tenant_slug")
        self.bind_session(session, tenant)
        try:
            yield tenant
        finally:
            if previous_scope is None:
                session.info.pop("tenant_scope", None)
            else:
                session.info["tenant_scope"] = previous_scope
            if previous_id is None:
                session.info.pop("tenant_id", None)
            else:
                session.info["tenant_id"] = previous_id
            if previous_slug is None:
                session.info.pop("tenant_slug", None)
            else:
                session.info["tenant_slug"] = previous_slug

    # -- Access control ---------------------------------------------------
    def validate_platform_token(self, token: str | None) -> bool:
        if not self._platform_token:
            return False
        if token is None:
            return False
        return secrets.compare_digest(self._platform_token, token)

    # -- Capacity enforcement --------------------------------------------
    def ensure_workspace_capacity(self, session: Session, tenant_id: int) -> None:
        self._check_limit(
            session,
            tenant_id,
            "max_workspaces",
            select(func.count(Workspace.id)).where(Workspace.tenant_id == tenant_id),
        )

    def ensure_property_capacity(self, session: Session, tenant_id: int) -> None:
        self._check_limit(
            session,
            tenant_id,
            "max_properties",
            select(func.count(Property.id)).where(Property.tenant_id == tenant_id),
        )

    def _check_limit(
        self,
        session: Session,
        tenant_id: int,
        key: str,
        usage_statement: Select[int],
    ) -> None:
        limit_value = self._get_limit_value(session, tenant_id, key)
        if limit_value is None:
            return
        usage = session.execute(usage_statement).scalar_one()
        if usage >= limit_value:
            raise TenantLimitError(key, limit_value)

    def _get_limit_value(self, session: Session, tenant_id: int, key: str) -> int | None:
        statement = select(TenantLimit).where(
            TenantLimit.tenant_id == tenant_id, TenantLimit.key == key
        )
        record = session.execute(statement).scalar_one_or_none()
        if record is None:
            return None
        return record.value

    def _ensure_limits(
        self,
        session: Session,
        tenant: Tenant,
        limits: TenantLimitProfile,
    ) -> None:
        for key, value in limits.as_dict().items():
            existing = session.execute(
                select(TenantLimit).where(
                    TenantLimit.tenant_id == tenant.id, TenantLimit.key == key
                )
            ).scalar_one_or_none()
            if existing:
                continue
            session.add(
                TenantLimit(
                    tenant_id=tenant.id,
                    key=key,
                    value=value,
                    enforced=True,
                )
            )

    # -- Migrations -------------------------------------------------------
    def apply_migrations(self, session: Session, tenant: Tenant) -> None:
        applied = {
            record.name
            for record in session.execute(
                select(TenantMigrationState).where(
                    TenantMigrationState.tenant_id == tenant.id
                )
            ).scalars()
        }
        for name, migration in self._migrations.items():
            if name in applied:
                continue
            migration.apply(session, tenant)
            session.add(
                TenantMigrationState(tenant_id=tenant.id, name=name)
            )
            session.flush()

    # -- Utilities --------------------------------------------------------
    def assert_property_access(self, session: Session, property_obj: Property) -> None:
        scope = session.info.get("tenant_scope")
        if scope == "platform":
            return
        tenant_id = session.info.get("tenant_id")
        if tenant_id is None:
            raise TenantIsolationError("Sessão não está associada a um tenant")
        if property_obj.tenant_id is None:
            raise TenantIsolationError("Propriedade não possui tenant atribuído")
        if property_obj.tenant_id != tenant_id:
            raise TenantIsolationError("Propriedade pertence a outro tenant")
