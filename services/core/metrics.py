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
_knowledge_base_views = None
_knowledge_base_completions = None
_knowledge_base_searches = None
_knowledge_base_snippets = None


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
        _knowledge_base_views = meter.create_counter(
            "bmad_core_knowledge_base_article_view_total",
            description="Visualizações de artigos da base de conhecimento",
        )
        _knowledge_base_completions = meter.create_counter(
            "bmad_core_knowledge_base_article_completion_total",
            description="Conclusões declaradas de artigos da base de conhecimento",
        )
        _knowledge_base_searches = meter.create_counter(
            "bmad_core_knowledge_base_search_total",
            description="Pesquisas realizadas na base de conhecimento",
        )
        _knowledge_base_snippets = meter.create_counter(
            "bmad_core_knowledge_base_snippet_usage_total",
            description="Snippets aplicados a partir da base de conhecimento",
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


def record_dashboard_occupancy(occupancy_rate: float, total_units: int, snapshot: str) -> None:
    _track_metric(
        "bmad_core_dashboard_occupancy_snapshot",
        {
            "occupancy_rate": f"{occupancy_rate:.4f}",
            "total_units": str(total_units),
            "snapshot": snapshot,
        },
    )


def record_dashboard_alerts(total: int, blocked: int, overdue: int) -> None:
    _track_metric(
        "bmad_core_dashboard_alerts_summary",
        {
            "total": str(total),
            "blocked": str(blocked),
            "overdue": str(overdue),
        },
    )


def record_dashboard_playbook_adoption(
    adoption_rate: float, total_executions: int, active_properties: int
) -> None:
    _track_metric(
        "bmad_core_dashboard_playbook_adoption",
        {
            "adoption_rate": f"{adoption_rate:.4f}",
            "total_executions": str(total_executions),
            "active_properties": str(active_properties),
        },
    )


def record_dashboard_nps(score: float, responses: int) -> None:
    _track_metric(
        "bmad_core_dashboard_nps_snapshot",
        {
            "score": f"{score:.2f}",
            "responses": str(responses),
        },
    )


def record_dashboard_sla(total: int, breached: int) -> None:
    _track_metric(
        "bmad_core_dashboard_sla_summary",
        {
            "total": str(total),
            "breached": str(breached),
        },
    )


def record_knowledge_base_article_view(article_id: str, category_id: str) -> None:
    _ensure_counters()
    attributes = _stringify({"article_id": article_id, "category_id": category_id})
    _knowledge_base_views.add(1, attributes)
    _track_metric("bmad_core_knowledge_base_article_view_total", attributes)


def record_knowledge_base_article_completion(
    article_id: str,
    category_id: str,
    duration_seconds: float | None = None,
) -> None:
    _ensure_counters()
    attributes = {"article_id": article_id, "category_id": category_id}
    if duration_seconds is not None:
        attributes["duration_seconds"] = f"{duration_seconds:.1f}"
    stringified = _stringify(attributes)
    _knowledge_base_completions.add(1, stringified)
    _track_metric("bmad_core_knowledge_base_article_completion_total", stringified)


def record_knowledge_base_search(query: str, hits: int, category_id: str | None) -> None:
    _ensure_counters()
    normalized_query = query.strip().lower()
    if len(normalized_query) > 80:
        normalized_query = normalized_query[:80]
    attributes = _stringify(
        {
            "query": normalized_query or "*",
            "hits": hits,
            "category_id": category_id or "all",
        }
    )
    _knowledge_base_searches.add(1, attributes)
    _track_metric("bmad_core_knowledge_base_search_total", attributes)


def record_knowledge_base_snippet(article_id: str, surface: str) -> None:
    _ensure_counters()
    attributes = _stringify({"article_id": article_id, "surface": surface})
    _knowledge_base_snippets.add(1, attributes)
    _track_metric("bmad_core_knowledge_base_snippet_usage_total", attributes)


def record_dashboard_kpi(name: str, value: float, unit: str) -> None:
    _track_metric(
        "bmad_core_dashboard_operational_kpi",
        {
            "name": name,
            "value": f"{value:.2f}",
            "unit": unit,
        },
    )
