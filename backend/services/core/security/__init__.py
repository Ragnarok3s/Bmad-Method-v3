"""Governança de acesso para operações do core."""
from __future__ import annotations

import json
import logging
from datetime import datetime, timezone
from typing import Any, Iterable, Mapping, Sequence

from fastapi import HTTPException, status
from sqlalchemy import Select, select
from sqlalchemy.orm import Session

from ..observability import record_audit_event, register_control_checkpoint
from ..domain.models import Agent, AgentRole, AuditLog, PermissionDefinition, RolePolicy
from ..domain.schemas import (
    GovernanceAuditRead,
    PermissionCreate,
    PermissionUpdate,
    RolePolicyCreate,
    RolePolicyRead,
    RolePolicyUpdate,
)

logger = logging.getLogger("bmad.core.security")

IAM_CONTROL_ACCESS = "IAM.AC-001"
IAM_CONTROL_POLICY_CHANGE = "IAM.AC-002"


def _register_access_checkpoint(
    control_id: str,
    *,
    status: str,
    actor: Agent | None,
    detail: Mapping[str, Any],
    tags: Mapping[str, Any] | None = None,
) -> None:
    register_control_checkpoint(
        control_id,
        status=status,
        actor_id=actor.id if actor else None,
        detail=dict(detail),
        tags=dict(tags or {}),
    )

ROLE_HIERARCHY: dict[AgentRole, set[AgentRole]] = {
    AgentRole.ADMIN: {
        AgentRole.ADMIN,
        AgentRole.PROPERTY_MANAGER,
        AgentRole.HOUSEKEEPING,
        AgentRole.OTA,
    },
    AgentRole.PROPERTY_MANAGER: {AgentRole.PROPERTY_MANAGER, AgentRole.HOUSEKEEPING},
    AgentRole.HOUSEKEEPING: {AgentRole.HOUSEKEEPING},
    AgentRole.OTA: {AgentRole.OTA},
}

DEFAULT_PERMISSION_MATRIX: dict[AgentRole, set[str]] = {
    AgentRole.ADMIN: {
        "governance.roles.read",
        "governance.roles.manage",
        "governance.permissions.read",
        "governance.permissions.manage",
        "governance.audit.view",
        "governance.audit.export",
    },
    AgentRole.PROPERTY_MANAGER: {
        "governance.roles.read",
        "governance.audit.view",
        "governance.audit.export",
    },
    AgentRole.HOUSEKEEPING: set(),
    AgentRole.OTA: {"governance.roles.read"},
}

DEFAULT_PERMISSION_CATALOG: tuple[PermissionCreate, ...] = (
    PermissionCreate(
        key="governance.roles.read",
        label="Consultar políticas de acesso",
        description="Permite listar políticas de papéis e consultar permissões ativas.",
        category="governanca",
    ),
    PermissionCreate(
        key="governance.roles.manage",
        label="Gerenciar políticas de papéis",
        description="Cria, atualiza e remove políticas de papéis no core.",
        category="governanca",
    ),
    PermissionCreate(
        key="governance.permissions.read",
        label="Consultar catálogo de permissões",
        description="Permite visualizar o catálogo de permissões disponível.",
        category="governanca",
    ),
    PermissionCreate(
        key="governance.permissions.manage",
        label="Gerenciar catálogo de permissões",
        description="Cria e atualiza permissões disponíveis para papéis.",
        category="governanca",
    ),
    PermissionCreate(
        key="governance.audit.view",
        label="Visualizar trilha de auditoria",
        description="Consulta eventos de auditoria relacionados à governança.",
        category="auditoria",
    ),
    PermissionCreate(
        key="governance.audit.export",
        label="Exportar trilha de auditoria",
        description="Permite gerar exportações CSV/PDF da trilha de auditoria.",
        category="auditoria",
    ),
)

DEFAULT_ROLE_POLICIES: tuple[RolePolicyCreate, ...] = (
    RolePolicyCreate(
        role=AgentRole.ADMIN,
        name="Administrador Global",
        persona="corporate",
        property_id=None,
        is_default=True,
        permissions=[
            "governance.roles.read",
            "governance.roles.manage",
            "governance.permissions.read",
            "governance.permissions.manage",
            "governance.audit.view",
            "governance.audit.export",
        ],
        inherits=[],
    ),
    RolePolicyCreate(
        role=AgentRole.PROPERTY_MANAGER,
        name="Gestor Operacional",
        persona="operacional",
        property_id=None,
        is_default=True,
        permissions=["governance.roles.read", "governance.audit.view", "governance.audit.export"],
        inherits=[AgentRole.HOUSEKEEPING],
    ),
    RolePolicyCreate(
        role=AgentRole.HOUSEKEEPING,
        name="Housekeeping Padrão",
        persona="field",
        property_id=None,
        is_default=True,
        permissions=[],
        inherits=[],
    ),
    RolePolicyCreate(
        role=AgentRole.OTA,
        name="Canal OTA",
        persona="partner",
        property_id=None,
        is_default=True,
        permissions=["governance.roles.read"],
        inherits=[],
    ),
)


def get_effective_roles(
    agent: Agent,
    session: Session | None = None,
    *,
    property_id: int | None = None,
) -> set[AgentRole]:
    roles = set(ROLE_HIERARCHY.get(agent.role, {agent.role}))
    if session is None:
        return roles

    query: Select[RolePolicy] = select(RolePolicy).where(RolePolicy.role == agent.role)
    if property_id is None:
        query = query.where(RolePolicy.property_id.is_(None))
    else:
        query = query.where(
            RolePolicy.property_id.is_(None) | (RolePolicy.property_id == property_id)
        )
    for policy in session.execute(query).scalars():
        for inherited in policy.inherits:
            try:
                roles.add(AgentRole(inherited))
            except ValueError:
                logger.warning("invalid_role_inheritance", inherited=inherited, policy_id=policy.id)
    return roles


def get_effective_permissions(
    session: Session, agent: Agent, *, property_id: int | None = None
) -> set[str]:
    base_roles = get_effective_roles(agent, session, property_id=property_id)
    permissions: set[str] = set()

    for role in base_roles:
        permissions.update(DEFAULT_PERMISSION_MATRIX.get(role, set()))

    role_names = {role for role in base_roles}
    policy_query: Select[RolePolicy] = select(RolePolicy).where(RolePolicy.role.in_(role_names))
    for policy in session.execute(policy_query).scalars():
        if policy.property_id is not None:
            if property_id is None or property_id != policy.property_id:
                continue
        permissions.update(policy.permissions)
    return permissions


def assert_role(
    agent: Agent,
    allowed: Iterable[AgentRole],
    *,
    session: Session | None = None,
    property_id: int | None = None,
) -> None:
    """Valida se o agente possui alguma das roles permitidas."""

    allowed_set = {role for role in allowed}
    effective_roles = get_effective_roles(agent, session, property_id=property_id)
    context = {
        "agent_id": agent.id,
        "allowed_roles": sorted(role.value for role in allowed_set),
        "effective_roles": sorted(role.value for role in effective_roles),
        "property_id": property_id,
    }
    if not agent.active:
        _register_access_checkpoint(
            IAM_CONTROL_ACCESS,
            status="rejected",
            actor=agent,
            detail={**context, "reason": "inactive"},
            tags={"check": "assert_role"},
        )
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Agente inativo")

    if effective_roles.intersection(allowed_set):
        _register_access_checkpoint(
            IAM_CONTROL_ACCESS,
            status="approved",
            actor=agent,
            detail=context,
            tags={"check": "assert_role"},
        )
        return

    _register_access_checkpoint(
        IAM_CONTROL_ACCESS,
        status="rejected",
        actor=agent,
        detail={**context, "reason": "missing_role"},
        tags={"check": "assert_role"},
    )
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acesso negado")


def assert_permission(
    session: Session,
    agent: Agent,
    permission: str,
    *,
    property_id: int | None = None,
) -> None:
    if not agent.active:
        _register_access_checkpoint(
            IAM_CONTROL_ACCESS,
            status="rejected",
            actor=agent,
            detail={
                "agent_id": agent.id,
                "permission": permission,
                "property_id": property_id,
                "reason": "inactive",
            },
            tags={"check": "assert_permission"},
        )
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Agente inativo")

    effective = get_effective_permissions(session, agent, property_id=property_id)
    if permission not in effective:
        _register_access_checkpoint(
            IAM_CONTROL_ACCESS,
            status="rejected",
            actor=agent,
            detail={
                "agent_id": agent.id,
                "permission": permission,
                "property_id": property_id,
                "effective_permissions": sorted(effective),
                "reason": "missing_permission",
            },
            tags={"check": "assert_permission"},
        )
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permissão insuficiente")

    _register_access_checkpoint(
        IAM_CONTROL_ACCESS,
        status="approved",
        actor=agent,
        detail={
            "agent_id": agent.id,
            "permission": permission,
            "property_id": property_id,
        },
        tags={"check": "assert_permission"},
    )


class SecurityService:
    def __init__(self, session: Session) -> None:
        self.session = session

    # region bootstrap -------------------------------------------------
    def ensure_bootstrap(self) -> None:
        self._bootstrap_permissions()
        self._bootstrap_role_policies()

    def _bootstrap_permissions(self) -> None:
        existing = {
            permission.key: permission
            for permission in self.session.execute(
                select(PermissionDefinition)
            ).scalars()
        }
        for definition in DEFAULT_PERMISSION_CATALOG:
            if definition.key in existing:
                current = existing[definition.key]
                updated = False
                if current.label != definition.label:
                    current.label = definition.label
                    updated = True
                if current.description != definition.description:
                    current.description = definition.description
                    updated = True
                if current.category != definition.category:
                    current.category = definition.category
                    updated = True
                if updated:
                    current.updated_at = datetime.now(timezone.utc)
                continue
            record = PermissionDefinition(
                key=definition.key,
                label=definition.label,
                description=definition.description,
                category=definition.category,
            )
            self.session.add(record)
        self.session.flush()

    def _bootstrap_role_policies(self) -> None:
        for policy in DEFAULT_ROLE_POLICIES:
            property_filter = (
                RolePolicy.property_id == policy.property_id
                if policy.property_id is not None
                else RolePolicy.property_id.is_(None)
            )
            exists = self.session.execute(
                select(RolePolicy).where(
                    RolePolicy.role == policy.role,
                    RolePolicy.name == policy.name,
                    RolePolicy.persona == policy.persona,
                    property_filter,
                )
            ).scalar_one_or_none()
            if exists:
                if sorted(exists.permissions) != sorted(policy.permissions):
                    exists.permissions = list(policy.permissions)
                expected_inherits = [
                    role.value if isinstance(role, AgentRole) else str(role)
                    for role in policy.inherits
                ]
                if sorted(exists.inherits) != sorted(expected_inherits):
                    exists.inherits = expected_inherits
                exists.is_default = policy.is_default
                continue
            record = RolePolicy(
                role=policy.role,
                name=policy.name,
                persona=policy.persona,
                property_id=policy.property_id,
                is_default=policy.is_default,
            )
            record.permissions = list(policy.permissions)
            record.inherits = [
                role.value if isinstance(role, AgentRole) else str(role)
                for role in policy.inherits
            ]
            self.session.add(record)
        self.session.flush()

    # endregion --------------------------------------------------------

    # region permission catalog ---------------------------------------
    def list_permissions(self, *, actor: Agent) -> list[PermissionDefinition]:
        assert_permission(self.session, actor, "governance.permissions.read")
        query = select(PermissionDefinition).order_by(PermissionDefinition.key)
        return list(self.session.execute(query).scalars())

    def create_permission(self, payload: PermissionCreate, *, actor: Agent | None) -> PermissionDefinition:
        if actor is not None:
            assert_permission(self.session, actor, "governance.permissions.manage")
        existing = self.session.execute(
            select(PermissionDefinition).where(PermissionDefinition.key == payload.key)
        ).scalar_one_or_none()
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Permissão já existe")
        permission = PermissionDefinition(
            key=payload.key,
            label=payload.label,
            description=payload.description,
            category=payload.category,
        )
        self.session.add(permission)
        self.session.flush()
        self._log("permission_created", actor, {"permission_id": permission.id, "key": permission.key})
        return permission

    def update_permission(
        self, permission_id: int, payload: PermissionUpdate, *, actor: Agent | None
    ) -> PermissionDefinition:
        if actor is not None:
            assert_permission(self.session, actor, "governance.permissions.manage")
        permission = self.session.get(PermissionDefinition, permission_id)
        if not permission:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Permissão não encontrada")
        if payload.label is not None:
            permission.label = payload.label
        if payload.description is not None:
            permission.description = payload.description
        if payload.category is not None:
            permission.category = payload.category
        permission.updated_at = datetime.now(timezone.utc)
        self.session.add(permission)
        self.session.flush()
        self._log(
            "permission_updated",
            actor,
            {"permission_id": permission.id, "fields": payload.model_dump(exclude_unset=True)},
        )
        return permission

    def delete_permission(self, permission_id: int, *, actor: Agent | None) -> None:
        if actor is not None:
            assert_permission(self.session, actor, "governance.permissions.manage")
        permission = self.session.get(PermissionDefinition, permission_id)
        if not permission:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Permissão não encontrada")
        self.session.delete(permission)
        self.session.flush()
        self._log("permission_deleted", actor, {"permission_id": permission_id})

    # endregion --------------------------------------------------------

    # region role policies --------------------------------------------
    def list_roles(
        self,
        *,
        actor: Agent,
        persona: str | None = None,
        property_id: int | None = None,
    ) -> list[RolePolicyRead]:
        assert_permission(self.session, actor, "governance.roles.read")
        query = select(RolePolicy).order_by(RolePolicy.role, RolePolicy.name)
        if persona:
            query = query.where(RolePolicy.persona == persona)
        if property_id is not None:
            query = query.where(RolePolicy.property_id == property_id)
        records = list(self.session.execute(query).scalars())
        return [RolePolicyRead.model_validate(record) for record in records]

    def create_role(self, payload: RolePolicyCreate, *, actor: Agent) -> RolePolicy:
        assert_permission(self.session, actor, "governance.roles.manage")
        self._ensure_permissions_exist(payload.permissions)
        policy = RolePolicy(
            role=payload.role,
            name=payload.name,
            persona=payload.persona,
            property_id=payload.property_id,
            is_default=payload.is_default,
        )
        policy.permissions = list(payload.permissions)
        policy.inherits = [role.value for role in payload.inherits]
        self.session.add(policy)
        self.session.flush()
        self._log(
            "role_policy_created",
            actor,
            {
                "role_policy_id": policy.id,
                "role": payload.role.value,
                "permissions": sorted(policy.permissions),
            },
        )
        return policy

    def update_role(self, policy_id: int, payload: RolePolicyUpdate, *, actor: Agent) -> RolePolicy:
        assert_permission(self.session, actor, "governance.roles.manage")
        policy = self.session.get(RolePolicy, policy_id)
        if not policy:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Política não encontrada")
        changes: dict[str, Any] = {}
        if payload.name is not None:
            policy.name = payload.name
            changes["name"] = payload.name
        if payload.persona is not None:
            policy.persona = payload.persona
            changes["persona"] = payload.persona
        if payload.property_id is not None:
            policy.property_id = payload.property_id
            changes["property_id"] = payload.property_id
        if payload.is_default is not None:
            policy.is_default = payload.is_default
            changes["is_default"] = payload.is_default
        if payload.permissions is not None:
            self._ensure_permissions_exist(payload.permissions)
            policy.permissions = list(payload.permissions)
            changes["permissions"] = sorted(policy.permissions)
        if payload.inherits is not None:
            policy.inherits = [role.value for role in payload.inherits]
            changes["inherits"] = [role.value for role in payload.inherits]
        policy.updated_at = datetime.now(timezone.utc)
        self.session.add(policy)
        self.session.flush()
        self._log(
            "role_policy_updated",
            actor,
            {"role_policy_id": policy.id, "changes": changes},
        )
        return policy

    def delete_role(self, policy_id: int, *, actor: Agent) -> None:
        assert_permission(self.session, actor, "governance.roles.manage")
        policy = self.session.get(RolePolicy, policy_id)
        if not policy:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Política não encontrada")
        if policy.is_default:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Política padrão não pode ser removida")
        self.session.delete(policy)
        self.session.flush()
        self._log("role_policy_deleted", actor, {"role_policy_id": policy_id})

    # endregion --------------------------------------------------------

    # region auditoria -------------------------------------------------
    def list_audit_trail(self, *, actor: Agent, limit: int = 100) -> list[GovernanceAuditRead]:
        assert_permission(self.session, actor, "governance.audit.view")
        query = (
            select(AuditLog)
            .where(
                AuditLog.action.in_(
                    [
                        "permission_created",
                        "permission_updated",
                        "permission_deleted",
                        "role_policy_created",
                        "role_policy_updated",
                        "role_policy_deleted",
                        "auth_login_success",
                        "auth_login_failure",
                        "agent_profile_updated",
                    ]
                )
            )
            .order_by(AuditLog.created_at.desc())
            .limit(limit)
        )
        entries: list[GovernanceAuditRead] = []
        for row in self.session.execute(query).scalars():
            detail = self._safe_detail(row.detail)
            entries.append(
                GovernanceAuditRead(
                    id=row.id,
                    action=row.action,
                    detail=detail,
                    created_at=row.created_at,
                    actor_id=row.agent_id,
                )
            )
        return entries

    # endregion --------------------------------------------------------

    def _ensure_permissions_exist(self, permissions: Sequence[str]) -> None:
        if not permissions:
            return
        query = select(PermissionDefinition.key).where(PermissionDefinition.key.in_(permissions))
        existing = set(self.session.execute(query).scalars())
        missing = sorted(set(permissions) - existing)
        if missing:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail={"missing_permissions": missing},
            )

    def _safe_detail(self, detail: str | None) -> dict[str, Any]:
        if not detail:
            return {}
        try:
            parsed = json.loads(detail)
            if isinstance(parsed, dict):
                return parsed
        except json.JSONDecodeError:
            logger.warning("invalid_audit_detail", detail=detail)
        return {"raw": detail}

    def _log(self, action: str, actor: Agent | None, detail: dict[str, Any]) -> None:
        record_audit_event(action, actor_id=actor.id if actor else None, detail=detail)
        _register_access_checkpoint(
            IAM_CONTROL_POLICY_CHANGE,
            status="logged",
            actor=actor,
            detail={"action": action, **detail},
            tags={"source": "security_service"},
        )
        payload = AuditLog(
            action=action,
            agent_id=actor.id if actor else None,
            detail=json.dumps(detail),
            created_at=datetime.now(timezone.utc),
        )
        self.session.add(payload)


from .auth import AuthenticationError, AuthenticationService, EnrollmentResult, LoginResult

__all__ = [
    "ROLE_HIERARCHY",
    "DEFAULT_PERMISSION_MATRIX",
    "assert_permission",
    "assert_role",
    "get_effective_permissions",
    "get_effective_roles",
    "SecurityService",
    "AuthenticationError",
    "AuthenticationService",
    "EnrollmentResult",
    "LoginResult",
]
