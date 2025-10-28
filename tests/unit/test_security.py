from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

import pytest

from services.core.domain.models import Agent, AgentRole, Base
from services.core.security import (
    SecurityService,
    assert_permission,
    assert_role,
    get_effective_permissions,
)
from services.core.domain.schemas import PermissionCreate, RolePolicyCreate


def build_session() -> Session:
    engine = create_engine("sqlite:///:memory:", future=True)
    Base.metadata.create_all(engine)
    return Session(engine)


def create_agent(session: Session, role: AgentRole, email: str) -> Agent:
    agent = Agent(name=email.split('@')[0].title(), email=email, role=role, active=True)
    session.add(agent)
    session.flush()
    return agent


def test_role_elevation_guard() -> None:
    session = build_session()
    service = SecurityService(session)
    service.ensure_bootstrap()

    admin = create_agent(session, AgentRole.ADMIN, 'admin@example.com')
    manager = create_agent(session, AgentRole.PROPERTY_MANAGER, 'gestor@example.com')

    # Admin possui permissão de gestão
    assert_permission(session, admin, 'governance.roles.manage')

    # Gestor operacional não pode elevar privilégios
    with pytest.raises(HTTPException) as exc:
        assert_permission(session, manager, 'governance.roles.manage')
    assert exc.value.status_code == status.HTTP_403_FORBIDDEN


def test_create_role_logs_audit_trail() -> None:
    session = build_session()
    service = SecurityService(session)
    service.ensure_bootstrap()

    admin = create_agent(session, AgentRole.ADMIN, 'seguranca@example.com')

    custom_permission = service.create_permission(
        PermissionCreate(
            key='governance.custom.analytics',
            label='Análises avançadas',
            description='Permite exportar relatórios agregados de governança',
            category='analytics'
        ),
        actor=admin,
    )

    policy = service.create_role(
        RolePolicyCreate(
            role=AgentRole.PROPERTY_MANAGER,
            name='Gestor Analytics',
            persona='operacional',
            property_id=None,
            permissions=[custom_permission.key, 'governance.roles.read'],
            inherits=[],
            is_default=False,
        ),
        actor=admin,
    )

    assert custom_permission.key in policy.permissions

    audit_entries = service.list_audit_trail(actor=admin, limit=10)
    assert any(entry.action == 'role_policy_created' for entry in audit_entries)


def test_custom_policy_grants_permission() -> None:
    session = build_session()
    service = SecurityService(session)
    service.ensure_bootstrap()

    admin = create_agent(session, AgentRole.ADMIN, 'owner@example.com')
    manager = create_agent(session, AgentRole.PROPERTY_MANAGER, 'manager@example.com')

    service.create_permission(
        PermissionCreate(
            key='reservations.override',
            label='Override de reservas',
            description='Permite forçar reservas em conflito',
            category='reservas'
        ),
        actor=admin,
    )

    service.create_role(
        RolePolicyCreate(
            role=AgentRole.PROPERTY_MANAGER,
            name='Gestor Residencial Norte',
            persona='operacional',
            property_id=42,
            permissions=['reservations.override'],
            inherits=[],
            is_default=False,
        ),
        actor=admin,
    )

    effective = get_effective_permissions(session, manager, property_id=42)
    assert 'reservations.override' in effective

    # Sem contexto da propriedade, permissão não deve aparecer
    effective_global = get_effective_permissions(session, manager)
    assert 'reservations.override' not in effective_global


def test_property_scoped_role_inheritance_reaches_assertions() -> None:
    session = build_session()
    service = SecurityService(session)
    service.ensure_bootstrap()

    admin = create_agent(session, AgentRole.ADMIN, 'delegator@example.com')
    manager = create_agent(session, AgentRole.PROPERTY_MANAGER, 'regional@example.com')

    service.create_role(
        RolePolicyCreate(
            role=AgentRole.PROPERTY_MANAGER,
            name='Gestor Regional',
            persona='operacional',
            property_id=21,
            permissions=[],
            inherits=[AgentRole.ADMIN],
            is_default=False,
        ),
        actor=admin,
    )

    with pytest.raises(HTTPException):
        assert_role(manager, {AgentRole.ADMIN}, session=session)

    assert_role(manager, {AgentRole.ADMIN}, session=session, property_id=21)
