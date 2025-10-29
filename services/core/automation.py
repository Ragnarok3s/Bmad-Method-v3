"""Fila e critérios dinâmicos para execuções automáticas de playbooks."""

from __future__ import annotations

from collections import deque
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Callable, Iterable
from uuid import uuid4

from .domain.playbooks import PlaybookTemplate
from .recommendations import Recommendation
from .metrics import (
    record_guest_message_latency,
    record_guest_preference_sync,
    record_guest_satisfaction,
)

AutomationPredicate = Callable[[Recommendation], bool]


@dataclass(slots=True)
class TriggerCriteria:
    """Conjunto de critérios configuráveis para disparar um playbook."""

    name: str
    predicate: AutomationPredicate
    minimum_score: float = 0.0
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass(slots=True)
class RegisteredTemplate:
    template: PlaybookTemplate
    criteria: TriggerCriteria
    auto_execute: bool = False


@dataclass(slots=True)
class AutomationQueueItem:
    """Item pronto para execução automática ou revisão humana."""

    id: str
    template_id: int
    recommendation_key: str
    created_at: datetime
    score: float
    triggered_by: str
    payload: dict[str, Any] = field(default_factory=dict)
    auto_execute: bool = False


class AutomationQueue:
    """Gerencia o ciclo de vida de execuções automáticas disparadas por recomendações."""

    def __init__(self) -> None:
        self._registry: dict[str, RegisteredTemplate] = {}
        self._queue: list[AutomationQueueItem] = []

    def register_template(
        self,
        template: PlaybookTemplate,
        *,
        criteria: TriggerCriteria,
        auto_execute: bool = False,
    ) -> None:
        key = f"{template.id}:{criteria.name}"
        self._registry[key] = RegisteredTemplate(template=template, criteria=criteria, auto_execute=auto_execute)

    def evaluate(
        self,
        recommendations: Iterable[Recommendation],
        *,
        triggered_by: str,
    ) -> list[AutomationQueueItem]:
        enqueued: list[AutomationQueueItem] = []
        for recommendation in recommendations:
            for binding in self._registry.values():
                if recommendation.score < binding.criteria.minimum_score:
                    continue
                if not binding.criteria.predicate(recommendation):
                    continue
                item = AutomationQueueItem(
                    id=uuid4().hex,
                    template_id=binding.template.id,
                    recommendation_key=recommendation.key,
                    created_at=datetime.now(timezone.utc),
                    score=recommendation.score,
                    triggered_by=triggered_by,
                    payload={
                        "template_summary": binding.template.summary,
                        "recommendation": recommendation.metadata,
                        "criteria": binding.criteria.metadata,
                    },
                    auto_execute=binding.auto_execute,
                )
                self._queue.append(item)
                enqueued.append(item)
        return enqueued

    def dequeue(self) -> AutomationQueueItem | None:
        if not self._queue:
            return None
        return self._queue.pop(0)

    def pending(self) -> list[AutomationQueueItem]:
        return list(self._queue)

    def clear(self) -> None:
        self._queue.clear()

    def registered_templates(self) -> list[RegisteredTemplate]:
        return list(self._registry.values())


def anomaly_trigger(metric: str, *, min_score: float = 0.6) -> TriggerCriteria:
    """Cria um critério padrão para acionar automações a partir de anomalias de AIOps."""

    metadata = {"metric": metric, "source": "aiops"}

    def _predicate(recommendation: Recommendation) -> bool:
        return recommendation.metadata.get("aiops_metric") == metric and recommendation.score >= min_score

    return TriggerCriteria(
        name=f"aiops::{metric}",
        predicate=_predicate,
        minimum_score=min_score,
        metadata=metadata,
    )


@dataclass(slots=True)
class GuestJourneySnapshot:
    reservation_id: int
    guest_email: str
    guest_name: str | None = None
    preferences: dict[str, Any] = field(default_factory=dict)
    journey_stage: str | None = None
    satisfaction_score: float | None = None
    check_in_completed: bool = False
    upsell_acceptance: float | None = None
    response_minutes: float | None = None
    response_channel: str | None = None
    updated_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


_SNAPSHOTS: dict[int, GuestJourneySnapshot] = {}
_SATISFACTION_HISTORY: deque[float] = deque(maxlen=200)
_RESPONSE_HISTORY: deque[float] = deque(maxlen=200)


def _register_snapshot(snapshot: GuestJourneySnapshot) -> None:
    _SNAPSHOTS[snapshot.reservation_id] = snapshot
    record_guest_preference_sync(snapshot.journey_stage)
    if snapshot.satisfaction_score is not None:
        record_guest_satisfaction(snapshot.satisfaction_score, touchpoint=snapshot.journey_stage)
        _SATISFACTION_HISTORY.append(snapshot.satisfaction_score)
    if snapshot.response_minutes is not None:
        record_guest_message_latency(snapshot.response_channel or "unknown", snapshot.response_minutes)
        _RESPONSE_HISTORY.append(snapshot.response_minutes)


def get_guest_snapshot(reservation_id: int) -> GuestJourneySnapshot | None:
    return _SNAPSHOTS.get(reservation_id)


def get_guest_journey_summary() -> dict[str, Any]:
    snapshots = list(_SNAPSHOTS.values())
    total = len(snapshots)
    check_in_completed = sum(1 for item in snapshots if item.check_in_completed)
    upsell_samples = [item.upsell_acceptance for item in snapshots if item.upsell_acceptance is not None]
    preferences: dict[str, int] = {}
    last_updated: datetime | None = None
    for snapshot in snapshots:
        if last_updated is None or snapshot.updated_at > last_updated:
            last_updated = snapshot.updated_at
        for key, value in snapshot.preferences.items():
            if isinstance(value, bool) and not value:
                continue
            normalized = key if isinstance(value, bool) else f"{key}:{value}"
            preferences[normalized] = preferences.get(normalized, 0) + 1

    satisfaction_average = (
        sum(_SATISFACTION_HISTORY) / len(_SATISFACTION_HISTORY)
        if _SATISFACTION_HISTORY
        else None
    )
    response_average = (
        sum(_RESPONSE_HISTORY) / len(_RESPONSE_HISTORY)
        if _RESPONSE_HISTORY
        else None
    )
    upsell_average = (
        sum(upsell_samples) / len(upsell_samples)
        if upsell_samples
        else None
    )

    completion_rate = (check_in_completed / total) if total else 0.0

    return {
        "active_journeys": total,
        "check_in_completion_rate": round(completion_rate, 4),
        "upsell_acceptance_rate": round(upsell_average, 4) if upsell_average is not None else None,
        "average_satisfaction": round(satisfaction_average, 2) if satisfaction_average is not None else None,
        "average_response_minutes": round(response_average, 2) if response_average is not None else None,
        "preferences": preferences,
        "last_updated_at": last_updated,
    }


class GuestJourneyAutomationBridge:
    """Sincroniza instantâneos de jornadas com a fila de automação."""

    def __init__(self, queue: AutomationQueue) -> None:
        self._queue = queue

    def sync(
        self,
        snapshot: GuestJourneySnapshot,
        recommendations: Iterable[Recommendation],
        *,
        triggered_by: str,
    ) -> list[AutomationQueueItem]:
        _register_snapshot(snapshot)
        return self._queue.evaluate(recommendations, triggered_by=triggered_by)

    def pending(self) -> list[AutomationQueueItem]:
        return self._queue.pending()
