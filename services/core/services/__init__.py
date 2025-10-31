"""Regras de negócio para propriedades, reservas e housekeeping."""
from __future__ import annotations

import json
import logging
import re
from datetime import date, datetime, timedelta, timezone
from math import ceil
from typing import TYPE_CHECKING, Any

from fastapi import HTTPException, status
from sqlalchemy import and_, func, or_, select
from sqlalchemy.orm import Session

from quality.privacy import enforce_retention_policy, mask_personal_identifiers

from ..analytics import PIPELINE
from ..automation import get_guest_journey_summary, get_guest_snapshot
from ..communications import CommunicationChannel, CommunicationMessage, CommunicationService
from ..config import PaymentGatewaySettings
from ..domain.models import (
    Agent,
    AgentRole,
    AuditLog,
    ExperienceSurveyResponse,
    ExperienceSurveyTouchpoint,
    HousekeepingStatus,
    HousekeepingTask,
    OTASyncQueue,
    OTASyncStatus,
    PartnerSLA,
    Property,
    Reservation,
    ReservationStatus,
    SLAStatus,
    Workspace,
)
from ..domain.playbooks import PlaybookTemplate
from ..domain.schemas import (
    AgentCreate,
    CriticalAlertExample,
    CriticalAlertSummary,
    DashboardMetricsRead,
    GuestExperienceAnalytics,
    GuestExperienceChatMessage,
    GuestExperienceCheckInStep,
    GuestExperienceOverviewRead,
    GuestExperienceUpsell,
    HousekeepingTaskCollection,
    HousekeepingTaskCreate,
    NPSSnapshot,
    OccupancySnapshot,
    OperationalKPIEntry,
    OperationalKPIs,
    PaginationMeta,
    PlaybookAdoptionSummary,
    PlaybookExecutionRead,
    PlaybookExecutionRequest,
    PlaybookTemplateCreate,
    PropertyCreate,
    ReservationCreate,
    ReservationRead,
    ReservationUpdateStatus,
    SLAMetricSummary,
    WorkspaceCreate,
)
from ..metrics import (
    record_dashboard_alerts,
    record_dashboard_guest_experience,
    record_dashboard_kpi,
    record_dashboard_nps,
    record_dashboard_occupancy,
    record_dashboard_playbook_adoption,
    record_dashboard_sla,
    record_dashboard_request,
    record_housekeeping_scheduled,
    record_housekeeping_transition,
    record_ota_enqueue,
    record_reservation_confirmed,
    record_reservation_status,
)
from ..security import assert_role
from ..observability import record_audit_event
from ..tenancy import TenantIsolationError
from .automation import AutomationService
from ..payments import (
    PaymentGatewayNotConfiguredError,
    PaymentProcessingError,
    PaymentService,
)

from .knowledge_base import KnowledgeBaseService
from .bundles import BundleUsageService

if TYPE_CHECKING:
    from ..tenancy import TenantManager


def _require_tenant_id(session: Session) -> int:
    tenant_id = session.info.get("tenant_id")
    if tenant_id is None:
        raise HTTPException(
            status_code=status.HTTP_412_PRECONDITION_FAILED,
            detail="Contexto de tenant não definido",
        )
    return int(tenant_id)


def _is_platform_scope(session: Session) -> bool:
    return session.info.get("tenant_scope") == "platform"


logger = logging.getLogger("bmad.core.services")



def _ensure_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


class PropertyService:
    def __init__(self, session: Session, tenant_manager: "TenantManager" | None = None) -> None:
        self.session = session
        self._tenant_manager = tenant_manager

    def create(self, payload: PropertyCreate) -> Property:
        if _is_platform_scope(self.session):
            raise HTTPException(
                status_code=status.HTTP_412_PRECONDITION_FAILED,
                detail="Defina um tenant antes de criar propriedades",
            )
        tenant_id = _require_tenant_id(self.session)
        if self._tenant_manager:
            self._tenant_manager.ensure_property_capacity(self.session, tenant_id)

        property_obj = Property(**payload.model_dump())
        property_obj.tenant_id = tenant_id
        self.session.add(property_obj)
        self.session.flush()
        logger.info(
            "property_created",
            extra={"property_id": property_obj.id, "tenant_id": tenant_id},
        )
        return property_obj

    def list(self) -> list[Property]:
        statement = select(Property).order_by(Property.name)
        if not _is_platform_scope(self.session):
            tenant_id = _require_tenant_id(self.session)
            statement = statement.where(Property.tenant_id == tenant_id)
        result = self.session.execute(statement)
        return list(result.scalars())


class WorkspaceService:
    def __init__(self, session: Session, tenant_manager: "TenantManager" | None = None) -> None:
        self.session = session
        self._tenant_manager = tenant_manager

    def _generate_slug(self, name: str) -> str:
        base = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-") or "workspace"
        slug = base
        index = 1
        while (
            self.session.execute(select(Workspace).where(Workspace.slug == slug)).scalar_one_or_none()
            is not None
        ):
            index += 1
            slug = f"{base}-{index}"
        return slug

    def create(self, payload: WorkspaceCreate) -> Workspace:
        if _is_platform_scope(self.session):
            raise HTTPException(
                status_code=status.HTTP_412_PRECONDITION_FAILED,
                detail="Contexto de tenant obrigatório para criar workspaces",
            )
        tenant_id = _require_tenant_id(self.session)
        if self._tenant_manager:
            self._tenant_manager.ensure_workspace_capacity(self.session, tenant_id)

        normalized_name = payload.name.strip()
        slug = self._generate_slug(normalized_name)
        unique_roles = sorted({role.strip() for role in payload.team_roles if role.strip()})
        workspace = Workspace(
            name=normalized_name,
            timezone=payload.timezone,
            team_size=payload.team_size,
            primary_use_case=payload.primary_use_case.strip(),
            communication_channel=payload.communication_channel,
            quarterly_goal=payload.quarterly_goal.strip(),
            enable_sandbox=payload.enable_sandbox,
            require_mfa=payload.require_mfa,
            security_notes=payload.security_notes,
            slug=slug,
            tenant_id=tenant_id,
        )
        workspace.invite_emails = [email.lower() for email in payload.invite_emails]
        workspace.team_roles = unique_roles
        self.session.add(workspace)
        self.session.flush()
        logger.info(
            "workspace_created",
            extra={
                "workspace_id": workspace.id,
                "slug": workspace.slug,
                "team_size": workspace.team_size,
            },
        )
        return workspace


class AgentService:
    def __init__(self, session: Session) -> None:
        self.session = session

    def create(self, payload: AgentCreate) -> Agent:
        agent = Agent(**payload.model_dump())
        self.session.add(agent)
        self.session.flush()
        logger.info(
            "agent_created",
            extra={"agent_id": agent.id, "role": agent.role.value},
        )
        return agent

    def get(self, agent_id: int) -> Agent:
        agent = self.session.get(Agent, agent_id)
        if not agent:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agente não encontrado")
        return agent

    def list(self) -> list[Agent]:
        result = self.session.execute(select(Agent).order_by(Agent.name))
        return list(result.scalars())

    def update_profile(
        self,
        agent_id: int,
        payload: AgentProfileUpdate,
        *,
        actor: Agent | None = None,
    ) -> Agent:
        agent = self.get(agent_id)
        if actor:
            assert_role(actor, {AgentRole.ADMIN})

        changes: dict[str, Any] = {}

        if payload.name is not None:
            normalized = payload.name.strip()
            if normalized and normalized != agent.name:
                agent.name = normalized
                changes["name"] = normalized

        if payload.role is not None and payload.role != agent.role:
            agent.role = payload.role
            changes["role"] = payload.role.value

        if payload.active is not None and payload.active != agent.active:
            agent.active = payload.active
            changes["active"] = payload.active

        if not changes:
            return agent

        self.session.add(agent)
        self.session.flush()

        detail_payload = {
            "agent_id": agent.id,
            "changes": changes,
            "actor_id": actor.id if actor else None,
        }

        log = AuditLog(
            agent_id=actor.id if actor else None,
            action="agent_profile_updated",
            detail=json.dumps(detail_payload),
        )
        self.session.add(log)

        record_audit_event(
            "agent_profile_updated",
            actor_id=actor.id if actor else None,
            detail=detail_payload,
        )

        logger.info(
            "agent_profile_updated",
            extra={
                "agent_id": agent.id,
                "changes": changes,
                "actor_id": actor.id if actor else None,
            },
        )

        return agent


class ReservationService:
    def __init__(
        self,
        session: Session,
        *,
        payment_service: PaymentService | None = None,
        payment_settings: PaymentGatewaySettings | None = None,
        tenant_manager: "TenantManager" | None = None,
        communication_service: CommunicationService | None = None,
    ) -> None:
        self.session = session
        self._payment_service = payment_service
        self._payment_settings = payment_settings
        self._tenant_manager = tenant_manager
        self._communications = communication_service

    def _get_payment_service(self) -> PaymentService | None:
        if self._payment_service:
            return self._payment_service
        if not self._payment_settings:
            return None
        try:
            self._payment_service = PaymentService(self.session, self._payment_settings)
        except PaymentGatewayNotConfiguredError:
            logger.warning("payment_service_unavailable", extra={"provider": self._payment_settings.provider})
            self._payment_settings = None
        return self._payment_service

    def _check_conflict(self, property_id: int, check_in: datetime, check_out: datetime) -> None:
        query = (
            select(Reservation)
            .where(Reservation.property_id == property_id)
            .where(Reservation.status != ReservationStatus.CANCELLED)
            .where(Reservation.check_out > check_in)
            .where(Reservation.check_in < check_out)
        )
        conflict = self.session.execute(query).scalar_one_or_none()
        if conflict:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Conflito de disponibilidade")

    def create(self, payload: ReservationCreate, actor: Agent | None = None) -> Reservation:
        property_obj = self.session.get(Property, payload.property_id)
        if not property_obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Propriedade não encontrada")
        if self._tenant_manager:
            try:
                self._tenant_manager.assert_property_access(self.session, property_obj)
            except TenantIsolationError as exc:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc)) from exc
        elif not _is_platform_scope(self.session):
            tenant_id = _require_tenant_id(self.session)
            if property_obj.tenant_id != tenant_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Propriedade pertence a outro tenant",
                )
        self._check_conflict(payload.property_id, payload.check_in, payload.check_out)

        data = payload.model_dump(exclude={"payment"})
        reservation = Reservation(**data)
        reservation.status = ReservationStatus.CONFIRMED
        if payload.payment:
            reservation.total_amount_minor = payload.payment.amount_minor
            reservation.currency_code = payload.payment.currency.upper()
            reservation.capture_on_check_in = payload.payment.capture_on_check_in
        self.session.add(reservation)
        self.session.flush()

        if payload.payment:
            payment_service = self._get_payment_service()
            if payment_service:
                try:
                    method = payment_service.tokenize_payment_method(
                        reservation, payload.payment.method
                    )
                    payment_service.preauthorize(reservation, payload.payment, method)
                except PaymentProcessingError as exc:
                    logger.error(
                        "payment_preauthorization_failed",
                        extra={
                            "reservation_id": reservation.id,
                            "provider": payload.payment.method.provider.value,
                        },
                    )
                    raise HTTPException(
                        status_code=status.HTTP_502_BAD_GATEWAY,
                        detail="Falha ao pré-autorizar pagamento",
                    ) from exc
            else:
                logger.warning(
                    "payment_service_missing",
                    extra={"reservation_id": reservation.id},
                )

        self._log_event(reservation, actor, "reservation_created")
        self._enqueue_sync(reservation, "create")
        record_reservation_confirmed(property_obj.id)
        logger.info(
            "reservation_confirmed",
            extra={
                "reservation_id": reservation.id,
                "property_id": property_obj.id,
                "actor_id": actor.id if actor else None,
            },
        )
        return reservation

    def update_status(self, reservation_id: int, payload: ReservationUpdateStatus, actor: Agent | None = None) -> Reservation:
        reservation = self.session.get(Reservation, reservation_id)
        if not reservation:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reserva não encontrada")
        reservation.status = payload.status
        self.session.add(reservation)
        self.session.flush()
        if (
            payload.status == ReservationStatus.CHECKED_IN
            and reservation.capture_on_check_in
        ):
            payment_service = self._get_payment_service()
            if payment_service:
                try:
                    payment_service.capture_for_check_in(reservation)
                    self.session.flush()
                except PaymentProcessingError as exc:
                    logger.error(
                        "payment_capture_error",
                        extra={
                            "reservation_id": reservation.id,
                            "provider": reservation.payment_intents[0].provider.value if reservation.payment_intents else None,
                        },
                    )
                    raise HTTPException(
                        status_code=status.HTTP_502_BAD_GATEWAY,
                        detail="Falha ao capturar pagamento na entrada",
                    ) from exc
            else:
                logger.warning(
                    "payment_capture_skipped",
                    extra={"reservation_id": reservation.id},
                )
        self._log_event(reservation, actor, f"reservation_status_{payload.status.value}")
        self._enqueue_sync(reservation, "update_status")
        record_reservation_status(payload.status.value, reservation.property_id)
        logger.info(
            "reservation_status_updated",
            extra={
                "reservation_id": reservation.id,
                "status": payload.status.value,
                "actor_id": actor.id if actor else None,
            },
        )
        return reservation


    def list_for_property(self, property_id: int) -> list[Reservation]:
        property_obj = self.session.get(Property, property_id)
        if not property_obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Propriedade não encontrada")
        if self._tenant_manager:
            try:
                self._tenant_manager.assert_property_access(self.session, property_obj)
            except TenantIsolationError as exc:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc)) from exc
        elif not _is_platform_scope(self.session):
            tenant_id = _require_tenant_id(self.session)
            if property_obj.tenant_id != tenant_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Propriedade pertence a outro tenant",
                )

        query = select(Reservation).where(Reservation.property_id == property_id).order_by(Reservation.check_in)
        result = self.session.execute(query)
        reservations = list(result.scalars())
        masked = []
        for reservation in reservations:
            sanitized = mask_personal_identifiers(
                {
                    "guest_name": reservation.guest_name,
                    "email": reservation.guest_email,
                    "document": "",
                    "tax_id": "",
                    "passport": "",
                }
            )
            reservation.guest_email = sanitized["email"]
            masked.append(reservation)
        logger.info(
            "reservations_listed",
            extra={
                "property_id": property_id,
                "reservations": len(reservations),
                "tenant_id": property_obj.tenant_id,
            },
        )
        return masked

    def enforce_retention(self, retention_days: int) -> int:
        query = select(Reservation)
        reservations = self.session.execute(query).scalars().all()
        serialized = [
            {
                "id": reservation.id,
                "created_at": reservation.created_at.strftime("%Y-%m-%d"),
            }
            for reservation in reservations
        ]
        filtered = enforce_retention_policy(serialized, retention_days)
        filtered_ids = {item["id"] for item in filtered}
        removed = 0
        for reservation in reservations:
            if reservation.id not in filtered_ids:
                self.session.delete(reservation)
                removed += 1
        return removed

    def _enqueue_sync(self, reservation: Reservation, action: str) -> None:
        payload = json.dumps(
            {
                "reservation_id": reservation.id,
                "property_id": reservation.property_id,
                "action": action,
                "status": reservation.status.value,
            }
        )
        job = OTASyncQueue(
            reservation_id=reservation.id,
            property_id=reservation.property_id,
            channel_id=1,
            payload=payload,
            status=OTASyncStatus.PENDING,
        )
        self.session.add(job)
        record_ota_enqueue(reservation.property_id, action)
        logger.info(
            "ota_job_enqueued",
            extra={
                "reservation_id": reservation.id,
                "property_id": reservation.property_id,
                "action": action,
            },
        )

    def _log_event(self, reservation: Reservation, actor: Agent | None, action: str) -> None:
        log = AuditLog(
            reservation_id=reservation.id,
            agent_id=actor.id if actor else None,
            action=action,
            detail=f"Status atual: {reservation.status.value}",
        )
        self.session.add(log)

    def get_guest_experience_overview(
        self,
        reservation_id: int,
    ) -> GuestExperienceOverviewRead:
        reservation = self.session.get(Reservation, reservation_id)
        if not reservation:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reserva não encontrada")

        reservation_payload = ReservationRead.model_validate(reservation, from_attributes=True)
        history: list[CommunicationMessage] = []
        tenant_slug = self.session.info.get("tenant_slug")
        if self._communications and tenant_slug:
            history = sorted(
                self._communications.history_for_reservation(
                    reservation_id, tenant_slug=tenant_slug
                ),
                key=lambda message: message.sent_at,
            )

        snapshot = get_guest_snapshot(reservation_id)
        preferences = dict(snapshot.preferences) if snapshot else {}
        journey_stage = snapshot.journey_stage if snapshot else None
        satisfaction = snapshot.satisfaction_score if snapshot else None

        if journey_stage is None:
            for message in reversed(history):
                stage = message.context.get("journey_stage") if message.context else None
                if stage:
                    journey_stage = stage
                    break

        precheck = next(
            (
                message
                for message in history
                if message.template_id == "guest_prearrival_checkin" and message.direction == "outbound"
            ),
            None,
        )

        identity_verified = bool(
            preferences.get("identity_verified")
            or (snapshot and snapshot.journey_stage and "identity" in snapshot.journey_stage)
        )

        check_in_completed = bool(
            (snapshot.check_in_completed if snapshot else False)
            or reservation.status in {ReservationStatus.CHECKED_IN, ReservationStatus.CHECKED_OUT}
        )

        steps: list[GuestExperienceCheckInStep] = [
            GuestExperienceCheckInStep(
                id="digital_precheck",
                title="Pré check-in digital",
                description="Formulário de check-in enviado ao hóspede",
                completed=precheck is not None,
                completed_at=precheck.sent_at if precheck else None,
            ),
            GuestExperienceCheckInStep(
                id="identity_verification",
                title="Documentos verificados",
                description="Validação de identidade concluída",
                completed=identity_verified,
                completed_at=(snapshot.updated_at if snapshot and identity_verified else None),
            ),
            GuestExperienceCheckInStep(
                id="arrival",
                title="Check-in concluído",
                description="Hóspede com acesso liberado",
                completed=check_in_completed,
                completed_at=reservation.check_in if check_in_completed else None,
            ),
        ]

        chat_timeline: list[GuestExperienceChatMessage] = [
            GuestExperienceChatMessage(
                id=message.id,
                author=message.author,
                direction=message.direction,
                channel=message.channel.value,
                content=message.body,
                sent_at=message.sent_at,
                status=message.status.value,
                template_id=None if message.template_id == "inbound.freeform" else message.template_id,
                metadata=message.context or {},
            )
            for message in history
        ]

        upsell_map: dict[str, GuestExperienceUpsell] = {}
        for message in history:
            context = message.context or {}
            offer_code = context.get("upsell_offer")
            if not offer_code:
                continue
            metadata = message.metadata.get("variables", {}) if message.metadata else {}
            key = offer_code
            if message.direction == "outbound":
                upsell_map[key] = GuestExperienceUpsell(
                    id=f"{offer_code}-{message.id}",
                    title=str(metadata.get("title") or offer_code.replace("_", " ").title()),
                    description=str(metadata.get("description") or message.body),
                    price_minor=metadata.get("price_minor"),
                    currency=metadata.get("currency_code"),
                    status="recommended",
                    conversion_probability=metadata.get("conversion_probability"),
                )
            else:
                response = context.get("upsell_response")
                if key not in upsell_map:
                    upsell_map[key] = GuestExperienceUpsell(
                        id=f"{offer_code}-{message.id}",
                        title=offer_code.replace("_", " ").title(),
                        description=message.body,
                        status="pending",
                        conversion_probability=None,
                    )
                if response == "accepted":
                    upsell_map[key].status = "accepted"
                elif response == "declined":
                    upsell_map[key].status = "declined"

        upsells = sorted(upsell_map.values(), key=lambda item: item.title)

        return GuestExperienceOverviewRead(
            reservation=reservation_payload,
            check_in=steps,
            chat=chat_timeline,
            upsells=upsells,
            preferences=preferences,
            satisfaction_score=satisfaction,
            journey_stage=journey_stage,
        )


class PlaybookTemplateService:
    def __init__(self, session: Session) -> None:
        self.session = session

    def list(self) -> list[PlaybookTemplate]:
        result = self.session.execute(select(PlaybookTemplate).order_by(PlaybookTemplate.name))
        return list(result.scalars())

    def create(self, payload: PlaybookTemplateCreate) -> PlaybookTemplate:
        template = PlaybookTemplate(
            name=payload.name.strip(),
            summary=payload.summary.strip(),
        )
        template.tags = payload.tags
        template.steps = payload.steps
        self.session.add(template)
        self.session.flush()
        logger.info(
            "playbook_template_created",
            extra={"playbook_id": template.id, "name": template.name},
        )
        return template

    def get(self, playbook_id: int) -> PlaybookTemplate:
        template = self.session.get(PlaybookTemplate, playbook_id)
        if not template:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Playbook não encontrado")
        return template

    def execute(
        self,
        playbook_id: int,
        payload: PlaybookExecutionRequest,
    ) -> PlaybookExecutionRead:
        template = self.get(playbook_id)
        automation = AutomationService(self.session)
        result = automation.execute(
            template,
            initiated_by=payload.initiated_by,
            context=payload.context,
        )
        return result


class HousekeepingService:
    def __init__(self, session: Session) -> None:
        self.session = session

    def schedule(self, payload: HousekeepingTaskCreate, actor: Agent) -> HousekeepingTask:
        assert_role(
            actor,
            {AgentRole.ADMIN, AgentRole.PROPERTY_MANAGER},
            property_id=payload.property_id,
        )
        property_obj = self.session.get(Property, payload.property_id)
        if not property_obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Propriedade não encontrada")

        task = HousekeepingTask(**payload.model_dump())
        self.session.add(task)
        self.session.flush()
        record_housekeeping_scheduled(task.property_id, actor.id)
        logger.info(
            "housekeeping_task_scheduled",
            extra={
                "task_id": task.id,
                "property_id": task.property_id,
                "actor_id": actor.id,
            },
        )
        return task

    def update_status(self, task_id: int, status_update: HousekeepingStatus, actor: Agent) -> HousekeepingTask:
        task = self.session.get(HousekeepingTask, task_id)
        if not task:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tarefa não encontrada")

        allowed_roles = {AgentRole.ADMIN, AgentRole.PROPERTY_MANAGER, AgentRole.HOUSEKEEPING}
        assert_role(actor, allowed_roles, property_id=task.property_id)
        if actor.role == AgentRole.HOUSEKEEPING and task.assigned_agent_id != actor.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Tarefa pertence a outro agente")

        task.status = status_update
        record_housekeeping_transition(task.property_id, status_update.value, actor.role.value)
        logger.info(
            "housekeeping_task_status_updated",
            extra={
                "task_id": task.id,
                "status": status_update.value,
                "actor_id": actor.id,
            },
        )
        self.session.add(task)
        self.session.flush()
        return task

    def list_for_property(
        self,
        property_id: int,
        *,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        status_filter: HousekeepingStatus | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> HousekeepingTaskCollection:
        property_obj = self.session.get(Property, property_id)
        if not property_obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Propriedade não encontrada")

        page = max(page, 1)
        page_size = max(1, min(page_size, 100))

        filters = [HousekeepingTask.property_id == property_id]
        if start_date:
            filters.append(HousekeepingTask.scheduled_date >= start_date)
        if end_date:
            filters.append(HousekeepingTask.scheduled_date <= end_date)
        if status_filter:
            filters.append(HousekeepingTask.status == status_filter)

        base_query = select(HousekeepingTask).where(*filters)
        count_subquery = select(HousekeepingTask.id).where(*filters).subquery()
        total = self.session.execute(select(func.count()).select_from(count_subquery)).scalar_one()

        total_pages = ceil(total / page_size) if total else 0
        if total_pages and page > total_pages:
            page = total_pages

        offset = (page - 1) * page_size if total else 0
        items_query = (
            base_query.order_by(HousekeepingTask.scheduled_date, HousekeepingTask.id)
            .offset(offset)
            .limit(page_size)
        )
        items = list(self.session.execute(items_query).scalars())

        return HousekeepingTaskCollection(
            items=items,
            pagination=PaginationMeta(
                page=page,
                page_size=page_size,
                total=total,
                total_pages=total_pages,
            ),
        )


class OTASynchronizer:
    """Orquestra a sincronização OTA com filas resilientes."""

    def __init__(self, session: Session) -> None:
        self.session = session

    def mark_in_flight(self, job_id: int) -> OTASyncQueue:
        job = self.session.get(OTASyncQueue, job_id)
        if not job:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job não encontrado")
        job.status = OTASyncStatus.IN_FLIGHT
        job.updated_at = datetime.now(timezone.utc)
        self.session.add(job)
        return job

    def mark_completed(self, job_id: int, success: bool) -> OTASyncQueue:
        job = self.session.get(OTASyncQueue, job_id)
        if not job:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job não encontrado")
        job.status = OTASyncStatus.SUCCESS if success else OTASyncStatus.FAILED
        job.updated_at = datetime.now(timezone.utc)
        self.session.add(job)
        return job

    def pending_jobs(self, limit: int = 20) -> list[OTASyncQueue]:
        query = select(OTASyncQueue).where(OTASyncQueue.status == OTASyncStatus.PENDING).limit(limit)
        result = self.session.execute(query)
        return list(result.scalars())


class OperationalMetricsService:
    """Calcula métricas agregadas para o dashboard operacional."""

    def __init__(self, session: Session, communications: CommunicationService | None = None) -> None:
        self.session = session
        self._communications = communications

    def get_overview(self, target_date: date | None = None) -> DashboardMetricsRead:
        PIPELINE.sync(self.session)
        snapshot_date = target_date or datetime.now(timezone.utc).date()
        occupancy = self._calculate_occupancy(snapshot_date)
        alerts = self._calculate_critical_alerts()
        playbook = self._calculate_playbook_adoption()
        nps = self._calculate_nps()
        sla = self._calculate_sla_summary()
        operational = self._calculate_operational_kpis(alerts, playbook)
        guest = self._calculate_guest_experience_metrics()

        record_dashboard_occupancy(
            occupancy.occupancy_rate,
            occupancy.total_units,
            snapshot_date.isoformat(),
        )
        record_dashboard_alerts(alerts.total, alerts.blocked, alerts.overdue)
        record_dashboard_playbook_adoption(
            playbook.adoption_rate,
            playbook.total_executions,
            playbook.active_properties,
        )
        record_dashboard_nps(nps.score, nps.total_responses)
        record_dashboard_sla(sla.total, sla.breached)
        record_dashboard_kpi(
            "housekeeping_completion_rate",
            operational.housekeeping_completion_rate.value,
            operational.housekeeping_completion_rate.unit,
        )
        record_dashboard_kpi(
            "ota_sync_backlog",
            operational.ota_sync_backlog.value,
            operational.ota_sync_backlog.unit,
        )
        if guest.satisfaction_score is not None:
            record_dashboard_guest_experience("satisfaction_score", guest.satisfaction_score)
        record_dashboard_guest_experience("check_in_completion_rate", guest.check_in_completion_rate)
        if guest.avg_response_minutes is not None:
            record_dashboard_guest_experience("avg_response_minutes", guest.avg_response_minutes)
        if guest.upsell_conversion_rate is not None:
            record_dashboard_guest_experience("upsell_conversion_rate", guest.upsell_conversion_rate)
        record_dashboard_guest_experience("active_journeys", float(guest.active_journeys))

        logger.info(
            "dashboard_metrics_computed",
            extra={
                "snapshot_date": snapshot_date.isoformat(),
                "occupancy_rate": occupancy.occupancy_rate,
                "critical_alerts": alerts.total,
                "playbook_adoption_rate": playbook.adoption_rate,
                "nps_score": nps.score,
                "sla_breached": sla.breached,
                "guest_satisfaction": guest.satisfaction_score,
            },
        )

        return DashboardMetricsRead(
            occupancy=occupancy,
            nps=nps,
            sla=sla,
            operational=operational,
            guest_experience=guest,
        )

    def _calculate_occupancy(self, target_date: date) -> OccupancySnapshot:
        active_reservations = (
            select(
                Reservation.property_id,
                func.count(Reservation.id).label("active_reservations"),
            )
            .where(
                Reservation.status.in_(
                    [ReservationStatus.CONFIRMED, ReservationStatus.CHECKED_IN]
                )
            )
            .where(func.date(Reservation.check_in) <= target_date)
            .where(func.date(Reservation.check_out) > target_date)
            .group_by(Reservation.property_id)
            .subquery()
        )

        rows = self.session.execute(
            select(
                Property.id,
                Property.units,
                active_reservations.c.active_reservations,
            ).outerjoin(active_reservations, Property.id == active_reservations.c.property_id)
        )

        total_units = 0
        occupied_units = 0
        for row in rows:
            units = row.units or 0
            active = row.active_reservations or 0
            total_units += units
            occupied_units += min(units, active)

        occupancy_rate = (occupied_units / total_units) if total_units else 0.0

        return OccupancySnapshot(
            date=target_date,
            occupied_units=int(occupied_units),
            total_units=int(total_units),
            occupancy_rate=round(occupancy_rate, 4),
        )

    def _calculate_critical_alerts(self) -> CriticalAlertSummary:
        now = datetime.now(timezone.utc)
        alert_rows = self.session.execute(
            select(
                HousekeepingTask.id,
                HousekeepingTask.property_id,
                HousekeepingTask.status,
                HousekeepingTask.scheduled_date,
            )
            .where(
                or_(
                    HousekeepingTask.status == HousekeepingStatus.BLOCKED,
                    and_(
                        HousekeepingTask.status != HousekeepingStatus.COMPLETED,
                        HousekeepingTask.scheduled_date < now,
                    ),
                )
            )
            .order_by(HousekeepingTask.scheduled_date.asc())
        ).all()

        blocked_ids: set[int] = set()
        overdue_ids: set[int] = set()
        examples_map: dict[int, CriticalAlertExample] = {}

        for row in alert_rows:
            task_id = row.id
            status = row.status
            scheduled_date = _ensure_utc(row.scheduled_date)
            if status == HousekeepingStatus.BLOCKED:
                blocked_ids.add(task_id)
            if status != HousekeepingStatus.COMPLETED and scheduled_date < now:
                overdue_ids.add(task_id)
            examples_map[task_id] = CriticalAlertExample(
                task_id=task_id,
                property_id=row.property_id,
                status=status,
                scheduled_date=scheduled_date,
            )

        examples = sorted(
            examples_map.values(), key=lambda item: item.scheduled_date
        )[:3]

        return CriticalAlertSummary(
            total=len(examples_map),
            blocked=len(blocked_ids),
            overdue=len(overdue_ids),
            examples=examples,
        )

    def _calculate_playbook_adoption(self) -> PlaybookAdoptionSummary:
        period_end = datetime.now(timezone.utc)
        period_start = period_end - timedelta(days=7)

        base_filters = [
            HousekeepingTask.reservation_id.is_not(None),
            HousekeepingTask.scheduled_date >= period_start,
            HousekeepingTask.scheduled_date < period_end,
        ]

        total_executions = (
            self.session.execute(select(func.count()).where(*base_filters)).scalar_one()
        )
        completed_executions = (
            self.session.execute(
                select(func.count()).where(
                    *base_filters,
                    HousekeepingTask.status == HousekeepingStatus.COMPLETED,
                )
            ).scalar_one()
        )
        active_properties = (
            self.session.execute(
                select(func.count(func.distinct(HousekeepingTask.property_id))).where(
                    *base_filters
                )
            ).scalar_one()
        )

        adoption_rate = (
            completed_executions / total_executions
            if total_executions
            else 0.0
        )

        return PlaybookAdoptionSummary(
            period_start=period_start,
            period_end=period_end,
            total_executions=int(total_executions),
            completed=int(completed_executions),
            adoption_rate=round(adoption_rate, 4),
            active_properties=int(active_properties),
        )

    def _calculate_guest_experience_metrics(self) -> GuestExperienceAnalytics:
        summary = get_guest_journey_summary()
        tenant_slug = self.session.info.get("tenant_slug")
        delivery = (
            self._communications.delivery_summary(tenant_slug=tenant_slug)
            if self._communications and tenant_slug
            else {}
        )

        satisfaction = summary.get("average_satisfaction")
        check_in_rate = summary.get("check_in_completion_rate", 0.0)
        active = summary.get("active_journeys", 0)

        response_minutes = delivery.get("average_response_minutes") if isinstance(delivery, dict) else None
        if response_minutes is None:
            response_minutes = summary.get("average_response_minutes")
        if response_minutes is not None:
            response_minutes = round(float(response_minutes), 2)

        upsell_info = delivery.get("upsell", {}) if isinstance(delivery, dict) else {}
        upsell_rate = upsell_info.get("conversion_rate")
        if upsell_rate is None:
            upsell_rate = summary.get("upsell_acceptance_rate")
        if upsell_rate is not None:
            upsell_rate = round(float(upsell_rate), 4)

        if satisfaction is not None:
            satisfaction = round(float(satisfaction), 2)

        return GuestExperienceAnalytics(
            satisfaction_score=satisfaction,
            check_in_completion_rate=round(float(check_in_rate), 4),
            avg_response_minutes=response_minutes,
            upsell_conversion_rate=upsell_rate,
            active_journeys=int(active),
        )

    def _calculate_nps(self) -> NPSSnapshot:
        responses = list(PIPELINE.dataset("nps_responses"))

        def _normalize(moment: datetime) -> datetime:
            if moment.tzinfo is None:
                return moment.replace(tzinfo=timezone.utc)
            return moment.astimezone(timezone.utc)

        normalized = [(response, _normalize(response.submitted_at)) for response in responses]

        total = len(normalized)
        promoters = sum(1 for response, _ in normalized if response.score >= 9)
        detractors = sum(1 for response, _ in normalized if response.score <= 6)
        passives = total - promoters - detractors
        score = ((promoters - detractors) / total * 100) if total else 0.0

        last_response_at = max((moment for _, moment in normalized), default=None)

        now = datetime.now(timezone.utc)
        last_week_cutoff = now - timedelta(days=7)
        previous_week_cutoff = now - timedelta(days=14)

        def _score(window: list[ExperienceSurveyResponse]) -> float | None:
            if not window:
                return None
            window_total = len(window)
            window_promoters = sum(1 for item in window if item.score >= 9)
            window_detractors = sum(1 for item in window if item.score <= 6)
            return ((window_promoters - window_detractors) / window_total) * 100

        last_week_responses = [
            response
            for response, moment in normalized
            if moment >= last_week_cutoff
        ]
        previous_week_responses = [
            response
            for response, moment in normalized
            if previous_week_cutoff <= moment < last_week_cutoff
        ]

        last_week_score = _score(last_week_responses)
        previous_week_score = _score(previous_week_responses)
        trend = (
            round(last_week_score - previous_week_score, 2)
            if last_week_score is not None and previous_week_score is not None
            else None
        )

        distribution: dict[ExperienceSurveyTouchpoint, float] = {}
        if total:
            for touchpoint in ExperienceSurveyTouchpoint:
                count = sum(1 for item in responses if item.touchpoint == touchpoint)
                distribution[touchpoint] = round((count / total) * 100, 2)

        return NPSSnapshot(
            score=round(score, 2),
            promoters=promoters,
            detractors=detractors,
            passives=passives,
            total_responses=total,
            trend_7d=trend,
            last_response_at=last_response_at,
            touchpoint_distribution=distribution,
        )

    def _calculate_sla_summary(self) -> SLAMetricSummary:
        slas: list[PartnerSLA] = list(PIPELINE.dataset("partner_slas"))
        total = len(slas)
        on_track = sum(1 for item in slas if item.status == SLAStatus.ON_TRACK)
        at_risk = sum(1 for item in slas if item.status == SLAStatus.AT_RISK)
        breached = sum(1 for item in slas if item.status == SLAStatus.BREACHED)

        offenders: list[tuple[str, int]] = []
        for item in slas:
            if item.status != SLAStatus.BREACHED:
                continue
            partner_name = item.partner.name if item.partner else "Parceiro"
            offenders.append((f"{partner_name} · {item.metric_label}", item.breach_minutes))
        offenders.sort(key=lambda pair: pair[1], reverse=True)

        return SLAMetricSummary(
            total=total,
            on_track=on_track,
            at_risk=at_risk,
            breached=breached,
            worst_offenders=[name for name, _ in offenders[:3]],
        )

    def _calculate_operational_kpis(
        self,
        alerts: CriticalAlertSummary,
        playbook: PlaybookAdoptionSummary,
    ) -> OperationalKPIs:
        now = datetime.now(timezone.utc)
        cutoff = now - timedelta(days=7)

        tasks: list[HousekeepingTask] = list(PIPELINE.dataset("housekeeping_tasks"))
        recent_tasks: list[HousekeepingTask] = []
        for task in tasks:
            scheduled = task.scheduled_date
            if scheduled.tzinfo is None:
                scheduled = scheduled.replace(tzinfo=timezone.utc)
            if scheduled >= cutoff:
                recent_tasks.append(task)

        total_recent = len(recent_tasks)
        completed_recent = sum(
            1 for task in recent_tasks if task.status == HousekeepingStatus.COMPLETED
        )
        completion_rate = (
            (completed_recent / total_recent) * 100 if total_recent else 0.0
        )

        completion_status = (
            "on_track"
            if completion_rate >= 85
            else "at_risk"
            if completion_rate >= 70
            else "breached"
        )

        ota_jobs: list[OTASyncQueue] = list(PIPELINE.dataset("ota_sync_queue"))
        def _status_value(status: OTASyncStatus | str) -> str:
            if isinstance(status, OTASyncStatus):
                return status.value
            return str(status)

        backlog = sum(
            1 for job in ota_jobs if _status_value(job.status) != OTASyncStatus.SUCCESS.value
        )

        return OperationalKPIs(
            critical_alerts=alerts,
            playbook_adoption=playbook,
            housekeeping_completion_rate=OperationalKPIEntry(
                name="Conclusão housekeeping (7d)",
                value=round(completion_rate, 2),
                unit="%",
                target=85.0,
                status=completion_status,
            ),
            ota_sync_backlog=OperationalKPIEntry(
                name="Backlog integrações OTA",
                value=float(backlog),
                unit="jobs",
                target=5.0,
                status="on_track" if backlog <= 5 else "at_risk" if backlog <= 15 else "breached",
            ),
        )
