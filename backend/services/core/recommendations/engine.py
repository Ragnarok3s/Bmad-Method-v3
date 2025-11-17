"""Regras heurísticas para gerar recomendações priorizadas a partir da telemetria."""

from __future__ import annotations

import logging
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from typing import Any, Callable, Iterable, Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..domain.models import (
    HousekeepingStatus,
    HousekeepingTask,
    PartnerSLA,
    Reservation,
    ReservationStatus,
    SLAStatus,
)
from ..domain.schemas import (
    PrecisionRecallReport,
    RecommendationExplanation as RecommendationExplanationSchema,
    RecommendationFeedbackRead,
    RecommendationPriority,
    RecommendationRead,
)

logger = logging.getLogger("bmad.core.recommendations")


@dataclass(slots=True)
class RecommendationSignal:
    """Representa um sinal bruto utilizado na composição de uma recomendação."""

    source: str
    description: str
    weight: float
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass(slots=True)
class Recommendation:
    """Recomendação com metadados e justificativas de priorização."""

    key: str
    title: str
    summary: str
    score: float
    source: str
    created_at: datetime
    signals: list[RecommendationSignal] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)
    actions: list[str] = field(default_factory=list)

    @property
    def priority(self) -> RecommendationPriority:
        return _priority_from_score(self.score)

    def to_schema(self) -> RecommendationRead:
        return RecommendationRead(
            key=self.key,
            title=self.title,
            summary=self.summary,
            priority=self.priority,
            score=round(self.score, 3),
            source=self.source,
            created_at=self.created_at,
            metadata=self.metadata,
            explainability=[
                RecommendationExplanationSchema(
                    signal=signal.source,
                    description=signal.description,
                    weight=max(0.0, min(signal.weight, 1.0)),
                )
                for signal in self.signals
            ],
            actions=self.actions,
        )


@dataclass(slots=True)
class EvaluationResult:
    """Resultado de uma avaliação de precisão/recall."""

    report: PrecisionRecallReport
    feedback_samples: list[RecommendationFeedbackRead] = field(default_factory=list)


class PrecisionRecallMonitor:
    """Calcula métricas de precisão/recall para o motor de recomendações."""

    def __init__(self) -> None:
        self.history: list[EvaluationResult] = []

    def evaluate(
        self,
        predicted_keys: Iterable[str],
        relevant_keys: Iterable[str],
        *,
        evaluated_at: datetime | None = None,
        window_start: datetime | None = None,
        window_end: datetime | None = None,
    ) -> EvaluationResult:
        predicted = {item for item in predicted_keys}
        relevant = {item for item in relevant_keys}

        true_positives = len(predicted & relevant)
        false_positives = len(predicted - relevant)
        false_negatives = len(relevant - predicted)
        total_predictions = len(predicted)
        total_relevant = len(relevant)

        precision = true_positives / total_predictions if total_predictions else 0.0
        recall = true_positives / total_relevant if total_relevant else 0.0

        report = PrecisionRecallReport(
            evaluated_at=evaluated_at or datetime.now(timezone.utc),
            window_start=window_start,
            window_end=window_end,
            precision=round(precision, 4),
            recall=round(recall, 4),
            true_positives=true_positives,
            false_positives=false_positives,
            false_negatives=false_negatives,
            total_predictions=total_predictions,
            total_relevant=total_relevant,
        )
        result = EvaluationResult(report=report)
        self.history.append(result)
        logger.debug(
            "recommendation_precision_recall",
            extra={
                "precision": report.precision,
                "recall": report.recall,
                "true_positives": true_positives,
                "false_positives": false_positives,
                "false_negatives": false_negatives,
            },
        )
        return result

    def assert_thresholds(self, *, min_precision: float, min_recall: float) -> None:
        if not self.history:
            raise ValueError("Nenhuma avaliação de precisão/recall disponível.")
        latest = self.history[-1].report
        if latest.precision < min_precision or latest.recall < min_recall:
            raise AssertionError(
                "Métricas de recomendação fora do esperado",
            )


class RecommendationEngine:
    """Gera recomendações combinando telemetria de reservas, housekeeping e SLAs."""

    def __init__(self, session: Session, *, now_provider: Callable[[], datetime] | None = None) -> None:
        self.session = session
        self._now_provider = now_provider or (lambda: datetime.now(timezone.utc))

    def generate(self, *, limit: int | None = None) -> list[Recommendation]:
        items: list[Recommendation] = []
        items.extend(self._collect_housekeeping_backlog())
        items.extend(self._collect_sla_risks())
        items.extend(self._collect_overdue_checkins())
        items.sort(key=lambda item: item.score, reverse=True)
        if limit is not None:
            return items[:limit]
        return items

    def _collect_housekeeping_backlog(self, hours: int = 24) -> list[Recommendation]:
        now = self._now()
        window = now + timedelta(hours=hours)
        stmt = (
            select(Reservation, HousekeepingTask)
            .join(HousekeepingTask, HousekeepingTask.reservation_id == Reservation.id)
            .where(Reservation.status == ReservationStatus.CONFIRMED)
            .where(HousekeepingTask.status.in_(
                (
                    HousekeepingStatus.PENDING,
                    HousekeepingStatus.IN_PROGRESS,
                    HousekeepingStatus.BLOCKED,
                )
            ))
            .where(Reservation.check_in <= window)
        )
        rows = self.session.execute(stmt).all()
        grouped: dict[int, list[HousekeepingTask]] = defaultdict(list)
        reservations: dict[int, Reservation] = {}
        for reservation, task in rows:
            if task is None:
                continue
            grouped[reservation.id].append(task)
            reservations[reservation.id] = reservation

        recommendations: list[Recommendation] = []
        for reservation_id, tasks in grouped.items():
            reservation = reservations[reservation_id]
            check_in = _ensure_aware(reservation.check_in)
            hours_to_check_in = max((check_in - now).total_seconds() / 3600, 0.0)
            time_factor = 1.0 - min(hours_to_check_in / hours, 1.0)
            status_weight = max(
                _STATUS_URGENCY.get(task.status, 0.4)
                for task in tasks
            )
            score = min(1.0, 0.35 + time_factor * 0.4 + status_weight * 0.25)
            summary = (
                "Check-in próximo com tarefas de housekeeping pendentes." if hours_to_check_in <= hours
                else "Reservas futuras com backlog de limpeza."
            )
            signals = [
                RecommendationSignal(
                    source="reservations",
                    description=(
                        f"Check-in em {hours_to_check_in:.1f} horas para {reservation.guest_name}."
                        if hours_to_check_in > 0
                        else f"Check-in em atraso para {reservation.guest_name}."
                    ),
                    weight=round(time_factor, 3),
                    metadata={
                        "reservation_id": reservation.id,
                        "check_in": check_in.isoformat(),
                        "property_id": reservation.property_id,
                    },
                ),
                RecommendationSignal(
                    source="housekeeping",
                    description=f"{len(tasks)} tarefas com estado crítico.",
                    weight=status_weight,
                    metadata={
                        "task_ids": [task.id for task in tasks],
                        "status_distribution": _status_distribution(tasks),
                    },
                ),
            ]
            metadata = {
                "reservation_id": reservation.id,
                "property_id": reservation.property_id,
                "housekeeping_task_ids": [task.id for task in tasks],
                "check_in": check_in.isoformat(),
            }
            actions = [
                "Acionar playbook de limpeza acelerada",
                "Notificar equipa de preparação de quartos",
            ]
            recommendations.append(
                Recommendation(
                    key=f"reservation:{reservation.id}:housekeeping_backlog",
                    title=f"Priorizar limpeza - {reservation.guest_name}",
                    summary=summary,
                    score=round(score, 3),
                    source="housekeeping",
                    created_at=now,
                    signals=signals,
                    metadata=metadata,
                    actions=actions,
                )
            )
        return recommendations

    def _collect_sla_risks(self) -> list[Recommendation]:
        now = self._now()
        stmt = select(PartnerSLA).where(PartnerSLA.status != SLAStatus.ON_TRACK)
        slas = [row[0] for row in self.session.execute(stmt).all()]
        recommendations: list[Recommendation] = []
        for sla in slas:
            status_weight = _SLA_STATUS_SCORE.get(sla.status, 0.4)
            threshold_denominator = max((sla.breach_minutes or 1) - (sla.warning_minutes or 0), 1)
            overage = 0.0
            if sla.current_minutes is not None and sla.warning_minutes is not None:
                overage = max(sla.current_minutes - sla.warning_minutes, 0) / threshold_denominator
            score = min(1.0, 0.45 + status_weight * 0.35 + min(overage, 1.0) * 0.2)
            summary = (
                f"SLA '{sla.metric_label}' do parceiro {sla.partner_id} está {sla.status.value.replace('_', ' ')}."
            )
            signals = [
                RecommendationSignal(
                    source="sla",
                    description=f"Estado atual: {sla.status.value}.",
                    weight=status_weight,
                    metadata={
                        "sla_id": sla.id,
                        "metric": sla.metric,
                        "partner_id": sla.partner_id,
                    },
                ),
            ]
            if sla.current_minutes is not None:
                signals.append(
                    RecommendationSignal(
                        source="telemetry",
                        description=f"Tempo atual {sla.current_minutes} minutos vs alvo {sla.target_minutes}.",
                        weight=min(overage, 1.0),
                        metadata={
                            "current_minutes": sla.current_minutes,
                            "target_minutes": sla.target_minutes,
                            "warning_minutes": sla.warning_minutes,
                            "breach_minutes": sla.breach_minutes,
                        },
                    )
                )
            metadata = {
                "sla_id": sla.id,
                "partner_id": sla.partner_id,
                "metric": sla.metric,
                "status": sla.status.value,
                "target_minutes": sla.target_minutes,
                "current_minutes": sla.current_minutes,
            }
            actions = [
                "Ativar playbook de contingência com parceiro",
                "Rever capacidade de atendimento",
            ]
            recommendations.append(
                Recommendation(
                    key=f"sla:{sla.id}:{sla.status.value}",
                    title=f"Risco de SLA - {sla.metric_label}",
                    summary=summary,
                    score=round(score, 3),
                    source="sla",
                    created_at=now,
                    signals=signals,
                    metadata=metadata,
                    actions=actions,
                )
            )
        return recommendations

    def _collect_overdue_checkins(self, tolerance: timedelta = timedelta(minutes=30)) -> list[Recommendation]:
        now = self._now()
        cutoff = now - tolerance
        stmt = (
            select(Reservation)
            .where(Reservation.status == ReservationStatus.CONFIRMED)
            .where(Reservation.check_in < cutoff)
        )
        reservations = [row[0] for row in self.session.execute(stmt).all()]
        recommendations: list[Recommendation] = []
        for reservation in reservations:
            check_in = _ensure_aware(reservation.check_in)
            delay_hours = max((now - check_in).total_seconds() / 3600, 0.0)
            score = min(1.0, 0.5 + min(delay_hours / 6, 1.0) * 0.5)
            signals = [
                RecommendationSignal(
                    source="reservations",
                    description=f"Check-in atrasado há {delay_hours:.1f} horas.",
                    weight=min(delay_hours / 6, 1.0),
                    metadata={
                        "reservation_id": reservation.id,
                        "property_id": reservation.property_id,
                    },
                ),
            ]
            metadata = {
                "reservation_id": reservation.id,
                "guest_name": reservation.guest_name,
                "check_in": check_in.isoformat(),
                "property_id": reservation.property_id,
            }
            actions = [
                "Contactar hóspede para confirmação",
                "Liberar inventário se necessário",
            ]
            recommendations.append(
                Recommendation(
                    key=f"reservation:{reservation.id}:overdue_check_in",
                    title=f"Check-in atrasado - {reservation.guest_name}",
                    summary="Hóspede não realizou check-in dentro da janela esperada.",
                    score=round(score, 3),
                    source="reservations",
                    created_at=now,
                    signals=signals,
                    metadata=metadata,
                    actions=actions,
                )
            )
        return recommendations

    def _now(self) -> datetime:
        return self._now_provider()


_STATUS_URGENCY: dict[HousekeepingStatus, float] = {
    HousekeepingStatus.BLOCKED: 1.0,
    HousekeepingStatus.PENDING: 0.85,
    HousekeepingStatus.IN_PROGRESS: 0.65,
    HousekeepingStatus.COMPLETED: 0.0,
}


_SLA_STATUS_SCORE: dict[SLAStatus, float] = {
    SLAStatus.BREACHED: 1.0,
    SLAStatus.AT_RISK: 0.75,
    SLAStatus.ON_TRACK: 0.3,
}


def _priority_from_score(score: float) -> RecommendationPriority:
    if score >= 0.8:
        return RecommendationPriority.HIGH
    if score >= 0.5:
        return RecommendationPriority.MEDIUM
    return RecommendationPriority.LOW


def _status_distribution(tasks: Sequence[HousekeepingTask]) -> dict[str, int]:
    distribution: dict[str, int] = defaultdict(int)
    for task in tasks:
        distribution[task.status.value] += 1
    return dict(distribution)


def _ensure_aware(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value
