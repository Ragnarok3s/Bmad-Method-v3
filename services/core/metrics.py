"""Métricas de domínio para o serviço core."""
from __future__ import annotations

from threading import Lock
from typing import Mapping

from opentelemetry import metrics


_COUNTERS_LOCK = Lock()
_COUNTERS_INITIALIZED = False

_reservations_created = None
_reservation_status_updates = None
_housekeeping_scheduled = None
_housekeeping_transitions = None
_ota_enqueued = None


def _ensure_counters() -> None:
    global _COUNTERS_INITIALIZED
    global _reservations_created
    global _reservation_status_updates
    global _housekeeping_scheduled
    global _housekeeping_transitions
    global _ota_enqueued

    if _COUNTERS_INITIALIZED:
        return

    with _COUNTERS_LOCK:
        if _COUNTERS_INITIALIZED:
            return

        meter = metrics.get_meter("bmad.core")

        _reservations_created = meter.create_counter(
            "bmad_core_reservations_confirmed_total",
            description="Total de reservas confirmadas",
        )
        _reservation_status_updates = meter.create_counter(
            "bmad_core_reservation_status_updates_total",
            description="Total de atualizações de status de reservas",
        )
        _housekeeping_scheduled = meter.create_counter(
            "bmad_core_housekeeping_tasks_scheduled_total",
            description="Quantidade de tarefas de housekeeping agendadas",
        )
        _housekeeping_transitions = meter.create_counter(
            "bmad_core_housekeeping_status_transition_total",
            description="Transições de status de housekeeping",
        )
        _ota_enqueued = meter.create_counter(
            "bmad_core_ota_sync_enqueued_total",
            description="Jobs enfileirados para sincronização OTA",
        )

        _COUNTERS_INITIALIZED = True


def _stringify(attributes: Mapping[str, object] | None = None) -> dict[str, str]:
    if not attributes:
        return {}
    return {key: str(value) for key, value in attributes.items()}


def record_reservation_confirmed(property_id: int) -> None:
    _ensure_counters()
    _reservations_created.add(1, _stringify({"property_id": property_id}))


def record_reservation_status(status: str, property_id: int) -> None:
    _ensure_counters()
    _reservation_status_updates.add(
        1, _stringify({"status": status, "property_id": property_id})
    )


def record_housekeeping_scheduled(property_id: int, assigned_agent_id: int) -> None:
    _ensure_counters()
    _housekeeping_scheduled.add(
        1,
        _stringify(
            {
                "property_id": property_id,
                "assigned_agent_id": assigned_agent_id,
            }
        ),
    )


def record_housekeeping_transition(
    property_id: int, status: str, actor_role: str
) -> None:
    _ensure_counters()
    _housekeeping_transitions.add(
        1,
        _stringify(
            {
                "property_id": property_id,
                "status": status,
                "actor_role": actor_role,
            }
        ),
    )


def record_ota_enqueue(property_id: int, action: str) -> None:
    _ensure_counters()
    _ota_enqueued.add(1, _stringify({"property_id": property_id, "action": action}))
