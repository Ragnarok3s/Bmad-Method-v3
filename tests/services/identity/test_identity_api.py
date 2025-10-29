"""Integration tests for the tenant-scoped identity API."""

from __future__ import annotations

from typing import Tuple

from fastapi.testclient import TestClient

from services.core.config import CoreSettings, ObservabilitySettings, TenantSettings
from services.core.database import get_database
from services.core.domain.models import Agent, AgentRole
from services.core.security import AuthenticationService
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


def provision_agent(database, tenant_manager, tenant_slug: str, *, email: str, role: AgentRole, secret: str) -> int:
    with database.session_scope() as session:
        tenant_manager.require_tenant(session, tenant_slug)
        agent = Agent(name=email.split("@")[0].title(), email=email, role=role, active=True)
        session.add(agent)
        session.flush()
        AuthenticationService(session).enroll_agent(agent, "Sup3rSecret!", mfa_secret=secret)
        session.flush()
        return agent.id


def test_tenant_login_requires_assignment(tmp_path) -> None:
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


def test_role_assignment_lifecycle(tmp_path) -> None:
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

    updated = client.put(
        f"/tenants/{tenant_slug}/roles/{agent_id}",
        json={"role": AgentRole.PROPERTY_MANAGER.value},
    )
    assert updated.status_code == 200
    assert updated.json()["role"] == AgentRole.PROPERTY_MANAGER.value

    listing_after_update = client.get(f"/tenants/{tenant_slug}/roles")
    assert listing_after_update.status_code == 200
    assert any(item["role"] == AgentRole.PROPERTY_MANAGER.value for item in listing_after_update.json())

    revoked = client.delete(f"/tenants/{tenant_slug}/roles/{agent_id}")
    assert revoked.status_code == 204

    listing_after_revoke = client.get(f"/tenants/{tenant_slug}/roles")
    assert listing_after_revoke.status_code == 200
    assert all(item["agent_id"] != agent_id for item in listing_after_revoke.json())
