"""Métricas de domínio para o serviço core."""
from __future__ import annotations

from threading import Lock
from typing import Mapping

from opentelemetry import metrics

from .observability import mark_signal_event


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


def _track_metric(instrument: str, attributes: Mapping[str, str] | None = None) -> None:
    mark_signal_event("metrics", instrument, attributes or {})


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
    attributes = _stringify(
        {
            "property_id": property_id,
            "assigned_agent_id": assigned_agent_id,
        }
    )
    _housekeeping_scheduled.add(1, attributes)
    _track_metric("bmad_core_housekeeping_tasks_scheduled_total", attributes)


def record_housekeeping_transition(
    property_id: int, status: str, actor_role: str
) -> None:
    _ensure_counters()
    attributes = _stringify(
        {
            "property_id": property_id,
            "status": status,
            "actor_role": actor_role,
        }
    )
    _housekeeping_transitions.add(1, attributes)
    _track_metric("bmad_core_housekeeping_status_transition_total", attributes)


def record_ota_enqueue(property_id: int, action: str) -> None:
    _ensure_counters()
    attributes = _stringify({"property_id": property_id, "action": action})
    _ota_enqueued.add(1, attributes)
    _track_metric("bmad_core_ota_sync_enqueued_total", attributes)


def record_dashboard_request(metric: str, success: bool) -> None:
    _track_metric(
        "bmad_core_dashboard_request_total",
        {
            "metric": metric,
            "success": "true" if success else "false",
        },
    )


def record_dashboard_occupancy(property_id: int, occupancy: float) -> None:
    _track_metric(
        "bmad_core_dashboard_occupancy_snapshot",
        {
            "property_id": str(property_id),
            "occupancy": f"{occupancy:.2f}",
        },
    )


def record_dashboard_alerts(blocked: int, overdue: int) -> None:
    _track_metric(
        "bmad_core_dashboard_alerts_summary",
        {
            "blocked": str(blocked),
            "overdue": str(overdue),
        },
    )


def record_dashboard_playbook_adoption(total: int, completed: int) -> None:
    _track_metric(
        "bmad_core_dashboard_playbook_adoption",
        {
            "total": str(total),
            "completed": str(completed),
        },
    )
