from __future__ import annotations

from datetime import datetime, timezone
from typing import Iterable

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..domain.models import Tenant, TenantLimit
from .manager import TenantMigration


def _ensure_observability_flag(session: Session, tenant: Tenant) -> None:
    attributes = dict(tenant.attributes)
    observability = dict(attributes.get("observability", {}))
    if observability.get("status") != "ready":
        observability.update(
            {
                "status": "ready",
                "last_verified_at": datetime.now(timezone.utc).isoformat(),
            }
        )
    attributes["observability"] = observability
    tenant.attributes = attributes
    session.add(tenant)


def _backfill_rate_limit(session: Session, tenant: Tenant) -> None:
    rate_limit = session.execute(
        select(TenantLimit).where(
            TenantLimit.tenant_id == tenant.id,
            TenantLimit.key == "api_rate_per_minute",
        )
    ).scalar_one_or_none()
    if rate_limit is None:
        session.add(
            TenantLimit(
                tenant_id=tenant.id,
                key="api_rate_per_minute",
                value=600,
                enforced=True,
            )
        )
    elif rate_limit.value is None:
        rate_limit.value = 600
        session.add(rate_limit)


def get_default_migrations() -> Iterable[TenantMigration]:
    return (
        TenantMigration(
            name="2024-05-tenant-observability-flags",
            handler=_ensure_observability_flag,
        ),
        TenantMigration(
            name="2024-05-backfill-rate-limit",
            handler=_backfill_rate_limit,
        ),
    )
