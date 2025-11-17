"""Integration tests for the tenant-scoped identity API."""

from __future__ import annotations

import json
from typing import Tuple

from fastapi.testclient import TestClient
from sqlalchemy import select

from services.core.config import CoreSettings, ObservabilitySettings, TenantSettings
from services.core.database import get_database
from services.core.domain.models import Agent, AgentRole, AuditLog
from services.core.security import AuthenticationService
from services.core import observability
from services.identity import build_application


def build_client(tmp_path) -> Tuple[TestClient, CoreSettings]:
    settings = CoreSettings(
        database_url=f"sqlite:///{tmp_path}/identity.db",
        tenancy=TenantSettings(platform_token="platform-secret"),
        enable_graphql=False,
        observability=ObservabilitySettings(enable_traces=False, enable_metrics=False, enable_logs=False),
    )
    app = build_application(settings)
    return TestClient(app), settings


def test_healthcheck_returns_ok(tmp_path) -> None:
    client, _ = build_client(tmp_path)
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def provision_agent(database, tenant_manager, tenant_slug: str, *, email: str, role: AgentRole, secret: str) -> int:
    with database.session_scope() as session:
        tenant_manager.require_tenant(session, tenant_slug)
        agent = Agent(name=email.split("@")[0].title(), email=email, role=role, active=True)
        session.add(agent)
        session.flush()
        AuthenticationService(session).enroll_agent(agent, "Sup3rSecret!", mfa_secret=secret)
        session.flush()
        return agent.id


def _fetch_audit_events(database, action: str) -> list[dict[str, object]]:
    with database.session_scope() as session:
        results = session.execute(
            select(AuditLog).where(AuditLog.action == action).order_by(AuditLog.created_at.desc())
        ).scalars()
        events: list[dict[str, object]] = []
        for record in results:
            detail = json.loads(record.detail or "{}")
            detail["agent_id"] = record.agent_id
            events.append(detail)
        return events


def _runtime_audit_events(action: str) -> list[dict[str, object]]:
    return [
        {**dict(event.detail), "actor_id": event.actor_id}
        for event in observability._STATE.audit_events
        if event.action == action
    ]


def test_tenant_login_requires_assignment(tmp_path) -> None:
    observability._STATE.audit_events.clear()
    client, settings = build_client(tmp_path)
    database = client.app.dependency_overrides[get_database]()
    tenant_manager = client.app.state.tenant_manager
    tenant_slug = settings.tenancy.default_slug

    agent_id = provision_agent(
        database,
        tenant_manager,
        tenant_slug,
        email="helena@example.com",
        role=AgentRole.ADMIN,
        secret="JBSWY3DPEHPK3PXP",
    )

    denied = client.post(
        f"/tenants/{tenant_slug}/login",
        json={"email": "helena@example.com", "password": "Sup3rSecret!"},
    )
    assert denied.status_code == 401

    assign = client.put(
        f"/tenants/{tenant_slug}/roles/{agent_id}",
        json={"role": AgentRole.ADMIN.value},
    )
    assert assign.status_code == 200

    login = client.post(
        f"/tenants/{tenant_slug}/login",
        json={"email": "helena@example.com", "password": "Sup3rSecret!"},
    )
    assert login.status_code == 200
    body = login.json()
    assert body["tenant"] == tenant_slug
    assert body["mfa_required"] is True

    otp = AuthenticationService.calculate_totp("JBSWY3DPEHPK3PXP")
    verify = client.post(
        f"/tenants/{tenant_slug}/mfa/verify",
        json={"session_id": body["session_id"], "code": otp},
    )
    assert verify.status_code == 200
    verified = verify.json()
    assert verified["mfa_required"] is False

    revoke = client.delete(f"/tenants/{tenant_slug}/roles/{agent_id}")
    assert revoke.status_code == 204

    forbidden = client.post(
        f"/tenants/{tenant_slug}/login",
        json={"email": "helena@example.com", "password": "Sup3rSecret!"},
    )
    assert forbidden.status_code == 401

    denied_events = _runtime_audit_events("tenant_access_denied")
    assert any(event.get("tenant_slug") == tenant_slug for event in denied_events)


def test_role_assignment_lifecycle(tmp_path) -> None:
    observability._STATE.audit_events.clear()
    client, settings = build_client(tmp_path)
    database = client.app.dependency_overrides[get_database]()
    tenant_manager = client.app.state.tenant_manager
    tenant_slug = settings.tenancy.default_slug

    agent_id = provision_agent(
        database,
        tenant_manager,
        tenant_slug,
        email="mario@example.com",
        role=AgentRole.HOUSEKEEPING,
        secret="NB2W45DFOIZA====",
    )

    assign = client.put(
        f"/tenants/{tenant_slug}/roles/{agent_id}",
        json={"role": AgentRole.HOUSEKEEPING.value},
    )
    assert assign.status_code == 200

    listing = client.get(f"/tenants/{tenant_slug}/roles")
    assert listing.status_code == 200
    items = listing.json()
    assert any(item["agent_id"] == agent_id and item["role"] == AgentRole.HOUSEKEEPING.value for item in items)
    assigned = next(item for item in items if item["agent_id"] == agent_id)
    assert assigned["agent_email"] == "mario@example.com"
    assert assigned["assigned_at"]

    updated = client.put(
        f"/tenants/{tenant_slug}/roles/{agent_id}",
        json={"role": AgentRole.PROPERTY_MANAGER.value},
    )
    assert updated.status_code == 200
    assert updated.json()["role"] == AgentRole.PROPERTY_MANAGER.value

    listing_after_update = client.get(f"/tenants/{tenant_slug}/roles")
    assert listing_after_update.status_code == 200
    assert any(item["role"] == AgentRole.PROPERTY_MANAGER.value for item in listing_after_update.json())
    updated_record = next(item for item in listing_after_update.json() if item["agent_id"] == agent_id)
    assert updated_record["agent_email"] == "mario@example.com"
    assert updated_record["updated_at"]

    revoked = client.delete(f"/tenants/{tenant_slug}/roles/{agent_id}")
    assert revoked.status_code == 204

    listing_after_revoke = client.get(f"/tenants/{tenant_slug}/roles")
    assert listing_after_revoke.status_code == 200
    assert all(item["agent_id"] != agent_id for item in listing_after_revoke.json())

    assignment_events = _fetch_audit_events(database, "tenant_role_assigned")
    created_events = [event for event in assignment_events if event.get("event") == "created"]
    updated_events = [event for event in assignment_events if event.get("event") == "updated"]
    assert any(event["role"] == AgentRole.HOUSEKEEPING.value for event in created_events)
    assert any(event["role"] == AgentRole.PROPERTY_MANAGER.value for event in updated_events)

    revoked_events = _fetch_audit_events(database, "tenant_role_revoked")
    assert any(event["tenant_slug"] == tenant_slug and event["agent_id"] == agent_id for event in revoked_events)


def test_multi_tenant_mfa_and_audit_enforcement(tmp_path) -> None:
    observability._STATE.audit_events.clear()
    client, settings = build_client(tmp_path)
    database = client.app.dependency_overrides[get_database]()
    tenant_manager = client.app.state.tenant_manager
    default_slug = settings.tenancy.default_slug

    secondary_slug = "tenant-b"
    with database.session_scope() as session:
        tenant_manager.ensure_tenant(session, secondary_slug, "Tenant B")

    agent_id = provision_agent(
        database,
        tenant_manager,
        default_slug,
        email="carla@example.com",
        role=AgentRole.ADMIN,
        secret="JBSWY3DPEHPK3PXP",
    )

    assign = client.put(
        f"/tenants/{default_slug}/roles/{agent_id}",
        json={"role": AgentRole.ADMIN.value},
    )
    assert assign.status_code == 200

    login_default = client.post(
        f"/tenants/{default_slug}/login",
        json={"email": "carla@example.com", "password": "Sup3rSecret!"},
    )
    assert login_default.status_code == 200
    session_payload = login_default.json()
    assert session_payload["mfa_required"] is True

    denied_cross_tenant = client.post(
        f"/tenants/{secondary_slug}/login",
        json={"email": "carla@example.com", "password": "Sup3rSecret!"},
    )
    assert denied_cross_tenant.status_code == 401

    audit_denied = _runtime_audit_events("tenant_access_denied")
    assert any(event.get("tenant_slug") == secondary_slug for event in audit_denied)

    revoked = client.delete(f"/tenants/{default_slug}/roles/{agent_id}")
    assert revoked.status_code == 204

    otp = AuthenticationService.calculate_totp("JBSWY3DPEHPK3PXP")
    denied_mfa = client.post(
        f"/tenants/{default_slug}/mfa/verify",
        json={"session_id": session_payload["session_id"], "code": otp},
    )
    assert denied_mfa.status_code == 403

    audit_after_revoke = _runtime_audit_events("tenant_access_denied")
    assert any(
        event.get("tenant_slug") == default_slug and event.get("reason") == "assignment_missing"
        for event in audit_after_revoke
    )
