"""Métricas de domínio para o serviço core."""
from __future__ import annotations

from typing import Mapping

from opentelemetry import metrics

_METER = metrics.get_meter("bmad.core")

_reservations_created = _METER.create_counter(
    "bmad_core_reservations_confirmed_total",
    description="Total de reservas confirmadas",
)
_reservation_status_updates = _METER.create_counter(
    "bmad_core_reservation_status_updates_total",
    description="Total de atualizações de status de reservas",
)
_housekeeping_scheduled = _METER.create_counter(
    "bmad_core_housekeeping_tasks_scheduled_total",
    description="Quantidade de tarefas de housekeeping agendadas",
)
_housekeeping_transitions = _METER.create_counter(
    "bmad_core_housekeeping_status_transition_total",
    description="Transições de status de housekeeping",
)
_ota_enqueued = _METER.create_counter(
    "bmad_core_ota_sync_enqueued_total",
    description="Jobs enfileirados para sincronização OTA",
)
_dashboard_requests = _METER.create_counter(
    "bmad_core_dashboard_requests_total",
    description="Total de requisições para métricas consolidadas do dashboard",
)
_dashboard_occupancy_rate = _METER.create_histogram(
    "bmad_core_dashboard_occupancy_rate",
    description="Distribuição da taxa de ocupação retornada pelo endpoint agregado",
)
_dashboard_alerts_total = _METER.create_histogram(
    "bmad_core_dashboard_critical_alerts_total",
    description="Distribuição do número de alertas críticos reportados",
)
_dashboard_playbook_rate = _METER.create_histogram(
    "bmad_core_dashboard_playbook_adoption_rate",
    description="Distribuição da taxa de adoção de playbooks calculada",
)


def _stringify(attributes: Mapping[str, object] | None = None) -> dict[str, str]:
    if not attributes:
        return {}
    return {key: str(value) for key, value in attributes.items()}


def record_reservation_confirmed(property_id: int) -> None:
    _reservations_created.add(1, _stringify({"property_id": property_id}))


def record_reservation_status(status: str, property_id: int) -> None:
    _reservation_status_updates.add(
        1, _stringify({"status": status, "property_id": property_id})
    )


def record_housekeeping_scheduled(property_id: int, assigned_agent_id: int) -> None:
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
    _ota_enqueued.add(1, _stringify({"property_id": property_id, "action": action}))


def record_dashboard_request(endpoint: str, success: bool) -> None:
    _dashboard_requests.add(
        1,
        _stringify({"endpoint": endpoint, "success": "true" if success else "false"}),
    )


def record_dashboard_occupancy(rate: float, total_units: int, date: str) -> None:
    _dashboard_occupancy_rate.record(
        rate,
        _stringify({"total_units": total_units, "date": date}),
    )


def record_dashboard_alerts(total: int, blocked: int, overdue: int) -> None:
    _dashboard_alerts_total.record(
        float(total),
        _stringify({"blocked": blocked, "overdue": overdue}),
    )


def record_dashboard_playbook_adoption(
    rate: float, total_executions: int, active_properties: int
) -> None:
    _dashboard_playbook_rate.record(
        rate,
        _stringify(
            {
                "total_executions": total_executions,
                "active_properties": active_properties,
            }
        ),
    )
