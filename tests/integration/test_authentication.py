from datetime import datetime, timedelta, timezone

from fastapi.testclient import TestClient

from services.core.config import CoreSettings, TenantSettings
from services.core.database import get_database
from services.core.domain.models import Agent, AgentRole, AuthSession, AuditLog
from services.core.main import build_application
from services.core.security import AuthenticationService


def build_client(tmp_path) -> TestClient:
    settings = CoreSettings(
        database_url=f"sqlite:///{tmp_path}/auth.db",
        tenancy=TenantSettings(platform_token="platform-secret"),
    )
    app = build_application(settings)
    return TestClient(app, headers={"x-tenant-slug": settings.tenancy.default_slug})


def enroll_agent(database, name: str, email: str, role: AgentRole, secret: str | None = None):
    with database.session_scope() as session:
        agent = Agent(name=name, email=email, role=role, active=True)
        session.add(agent)
        session.flush()
        service = AuthenticationService(session)
        enrollment = service.enroll_agent(
            agent,
            "Sup3rSecret!",
            mfa_secret=secret,
        )
        session.flush()
        return agent.id, enrollment


def test_mfa_login_and_recovery_flow(tmp_path) -> None:
    client = build_client(tmp_path)
    database = client.app.dependency_overrides[get_database]()

    agent_id, enrollment = enroll_agent(
        database,
        name="Helena",
        email="helena@example.com",
        role=AgentRole.ADMIN,
        secret="JBSWY3DPEHPK3PXP",
    )

    login_response = client.post(
        "/auth/login",
        json={"email": "helena@example.com", "password": "Sup3rSecret!"},
    )
    assert login_response.status_code == 200
    login_body = login_response.json()
    assert login_body["mfa_required"] is True
    session_id = login_body["session_id"]

    otp = AuthenticationService.calculate_totp(enrollment.mfa_secret)
    verify_response = client.post(
        "/auth/mfa/verify",
        json={"session_id": session_id, "code": otp},
    )
    assert verify_response.status_code == 200
    verify_body = verify_response.json()
    assert verify_body["mfa_required"] is False
    assert verify_body["recovery_codes_remaining"] == len(enrollment.recovery_codes)

    # Force session expiration and validate rejection
    with database.session_scope() as session:
        stored_session = session.get(AuthSession, session_id)
        stored_session.expires_at = datetime.now(timezone.utc) - timedelta(seconds=1)
        session.add(stored_session)

    expired_attempt = client.post(
        "/auth/mfa/verify",
        json={"session_id": session_id, "code": otp},
    )
    assert expired_attempt.status_code == 401

    # Recovery flow generates one-time codes
    recovery_init = client.post(
        "/auth/recovery/initiate",
        json={"email": "helena@example.com"},
    )
    assert recovery_init.status_code == 200
    recovery_body = recovery_init.json()
    assert len(recovery_body["recovery_codes"]) >= 1
    recovery_code = recovery_body["recovery_codes"][0]

    recovery_complete = client.post(
        "/auth/recovery/complete",
        json={"email": "helena@example.com", "code": recovery_code},
    )
    assert recovery_complete.status_code == 200
    complete_body = recovery_complete.json()
    assert complete_body["mfa_required"] is False

    reuse_attempt = client.post(
        "/auth/recovery/complete",
        json={"email": "helena@example.com", "code": recovery_code},
    )
    assert reuse_attempt.status_code == 401


def test_bruteforce_lock_and_alerts(tmp_path) -> None:
    client = build_client(tmp_path)
    database = client.app.dependency_overrides[get_database]()

    agent_id, _ = enroll_agent(
        database,
        name="Marcos",
        email="marcos@example.com",
        role=AgentRole.PROPERTY_MANAGER,
        secret="NB2W45DFOIZA====",
    )

    for attempt in range(5):
        response = client.post(
            "/auth/login",
            json={"email": "marcos@example.com", "password": "wrong"},
        )
        assert response.status_code == 401

    locked_response = client.post(
        "/auth/login",
        json={"email": "marcos@example.com", "password": "wrong"},
    )
    assert locked_response.status_code == 423
    detail = locked_response.json()
    assert "locked_until" in detail["detail"]

    # Observability snapshot should report the critical alert
    status_response = client.get("/health/otel")
    assert status_response.status_code == 200
    status_body = status_response.json()
    assert status_body["alerts"]["total"] >= 1
    assert any(
        alert["kind"] == "auth.account_locked" for alert in status_body["alerts"]["critical"]
    )


def test_agent_profile_update_records_audit(tmp_path) -> None:
    client = build_client(tmp_path)
    database = client.app.dependency_overrides[get_database]()

    with database.session_scope() as session:
        admin = Agent(name="Admin", email="admin@example.com", role=AgentRole.ADMIN, active=True)
        target = Agent(name="Bruno", email="bruno@example.com", role=AgentRole.OTA, active=True)
        session.add_all([admin, target])
        session.flush()
        admin_id = admin.id
        target_id = target.id

    update_response = client.patch(
        f"/agents/{target_id}",
        headers={"x-actor-id": str(admin_id)},
        json={"name": "Bruno Silva", "active": False},
    )
    assert update_response.status_code == 200
    body = update_response.json()
    assert body["name"] == "Bruno Silva"
    assert body["active"] is False

    with database.session_scope() as session:
        audit_entries = session.query(AuditLog).filter(AuditLog.action == "agent_profile_updated").all()
        assert audit_entries, "expected audit log entry for profile update"
        latest = audit_entries[-1]
        assert str(target_id) in latest.detail

    status_response = client.get("/health/otel")
    assert status_response.status_code == 200
    status_body = status_response.json()
    recent_actions = [event["action"] for event in status_body["audit"]["recent"]]
    assert "agent_profile_updated" in recent_actions
