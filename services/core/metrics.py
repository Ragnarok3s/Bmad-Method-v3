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
_payment_tokenized = None
_payment_preauthorized = None
_payment_captured = None
_payment_failed = None
_invoices_issued = None
_payment_reconciliations = None
_pricing_simulations = None
_pricing_bulk_updates = None
_pricing_accuracy = None
_pricing_impact = None
_guest_messages_sent = None
_guest_messages_failed = None
_guest_message_latency = None
_guest_satisfaction = None
_guest_preference_sync = None
_dashboard_alerts = None


def _ensure_counters() -> None:
    global _COUNTERS_INITIALIZED
    global _reservations_created
    global _reservation_status_updates
    global _housekeeping_scheduled
    global _housekeeping_transitions
    global _ota_enqueued
    global _knowledge_base_views
    global _knowledge_base_completions
    global _knowledge_base_searches
    global _knowledge_base_snippets
    global _payment_tokenized
    global _payment_preauthorized
    global _payment_captured
    global _payment_failed
    global _invoices_issued
    global _payment_reconciliations
    global _pricing_simulations
    global _pricing_bulk_updates
    global _pricing_accuracy
    global _pricing_impact
    global _guest_messages_sent
    global _guest_messages_failed
    global _guest_message_latency
    global _guest_satisfaction
    global _guest_preference_sync
    global _dashboard_alerts

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
        _payment_tokenized = meter.create_counter(
            "bmad_core_payments_tokenized_total",
            description="Métodos de pagamento tokenizados",
        )
        _payment_preauthorized = meter.create_counter(
            "bmad_core_payments_preauthorized_total",
            description="Pré autorizações registradas",
        )
        _payment_captured = meter.create_counter(
            "bmad_core_payments_captured_total",
            description="Capturas de pagamento efetuadas",
        )
        _payment_failed = meter.create_counter(
            "bmad_core_payments_failed_total",
            description="Falhas em pagamentos",
        )
        _invoices_issued = meter.create_counter(
            "bmad_core_invoices_issued_total",
            description="Faturas emitidas automaticamente",
        )
        _payment_reconciliations = meter.create_counter(
            "bmad_core_payments_reconciliation_total",
            description="Execuções de reconciliação de pagamentos",
        )
        _pricing_simulations = meter.create_counter(
            "bmad_core_pricing_simulations_total",
            description="Simulações de precificação realizadas",
        )
        _pricing_bulk_updates = meter.create_counter(
            "bmad_core_pricing_bulk_updates_total",
            description="Atualizações em lote de tarifas aplicadas",
        )
        _pricing_accuracy = meter.create_histogram(
            "bmad_core_pricing_accuracy",
            description="Acurácia prevista para recomendações de tarifa",
            unit="ratio",
        )
        _pricing_impact = meter.create_histogram(
            "bmad_core_pricing_revenue_delta_minor",
            description="Impacto financeiro estimado das atualizações de tarifa (minor units)",
            unit="1",
        )
        _guest_messages_sent = meter.create_counter(
            "bmad_core_guest_messages_sent_total",
            description="Mensagens transacionais enviadas para hóspedes",
        )
        _guest_messages_failed = meter.create_counter(
            "bmad_core_guest_messages_failed_total",
            description="Falhas em mensagens transacionais para hóspedes",
        )
        _guest_message_latency = meter.create_histogram(
            "bmad_core_guest_message_response_time_minutes",
            description="Tempo entre mensagem e resposta do hóspede",
            unit="min",
        )
        _guest_satisfaction = meter.create_histogram(
            "bmad_core_guest_satisfaction_score",
            description="Distribuição de satisfação dos hóspedes",
            unit="score",
        )
        _guest_preference_sync = meter.create_counter(
            "bmad_core_guest_preference_sync_total",
            description="Sincronizações de preferências e jornadas de hóspedes",
        )
        _dashboard_alerts = meter.create_counter(
            "bmad_core_dashboard_alerts_total",
            description="Alertas acompanhados no dashboard operacional",
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
    _ensure_counters()

    total_attributes = _stringify({"state": "total"})
    blocked_attributes = _stringify({"state": "blocked"})
    overdue_attributes = _stringify({"state": "overdue"})

    _dashboard_alerts.add(total, total_attributes)
    _dashboard_alerts.add(blocked, blocked_attributes)
    _dashboard_alerts.add(overdue, overdue_attributes)

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


def record_payment_tokenized(provider: str, property_id: int) -> None:
    _ensure_counters()
    attributes = _stringify({"provider": provider, "property_id": property_id})
    _payment_tokenized.add(1, attributes)
    _track_metric("bmad_core_payments_tokenized_total", attributes)


def record_payment_preauthorized(provider: str, property_id: int, amount_minor: int) -> None:
    _ensure_counters()
    attributes = _stringify(
        {
            "provider": provider,
            "property_id": property_id,
            "amount_minor": amount_minor,
        }
    )
    _payment_preauthorized.add(1, attributes)
    _track_metric("bmad_core_payments_preauthorized_total", attributes)


def record_payment_capture(provider: str, property_id: int, amount_minor: int) -> None:
    _ensure_counters()
    attributes = _stringify(
        {
            "provider": provider,
            "property_id": property_id,
            "amount_minor": amount_minor,
        }
    )
    _payment_captured.add(1, attributes)
    _track_metric("bmad_core_payments_captured_total", attributes)


def record_payment_failure(provider: str, property_id: int) -> None:
    _ensure_counters()
    attributes = _stringify({"provider": provider, "property_id": property_id})
    _payment_failed.add(1, attributes)
    _track_metric("bmad_core_payments_failed_total", attributes)


def record_invoice_issued(property_id: int, amount_minor: int, currency_code: str) -> None:
    _ensure_counters()
    attributes = _stringify(
        {
            "property_id": property_id,
            "amount_minor": amount_minor,
            "currency": currency_code,
        }
    )
    _invoices_issued.add(1, attributes)
    _track_metric("bmad_core_invoices_issued_total", attributes)


def record_payment_reconciliation(status: str, total: int, discrepancies: int) -> None:
    _ensure_counters()
    attributes = _stringify(
        {
            "status": status,
            "total_intents": total,
            "discrepancies": discrepancies,
        }
    )
    _payment_reconciliations.add(1, attributes)
    _track_metric("bmad_core_payments_reconciliation_total", attributes)


def record_dashboard_kpi(name: str, value: float, unit: str) -> None:
    _track_metric(
        "bmad_core_dashboard_operational_kpi",
        {
            "name": name,
            "value": f"{value:.2f}",
            "unit": unit,
        },
    )


def record_pricing_simulation(property_id: int, nights: int) -> None:
    _ensure_counters()
    attributes = _stringify({"property_id": property_id, "nights": nights})
    _pricing_simulations.add(1, attributes)
    _track_metric("bmad_core_pricing_simulations_total", attributes)


def record_pricing_bulk_update(property_id: int, reservations: int) -> None:
    _ensure_counters()
    attributes = _stringify({"property_id": property_id, "reservations": reservations})
    _pricing_bulk_updates.add(reservations, attributes)
    _track_metric("bmad_core_pricing_bulk_updates_total", attributes)


def record_pricing_accuracy(property_id: int, accuracy_ratio: float) -> None:
    _ensure_counters()
    attributes = _stringify({"property_id": property_id})
    _pricing_accuracy.record(accuracy_ratio, attributes)
    tracked = dict(attributes)
    tracked["accuracy_ratio"] = f"{accuracy_ratio:.4f}"
    _track_metric("bmad_core_pricing_accuracy", tracked)


def record_pricing_impact(property_id: int, delta_minor: int) -> None:
    _ensure_counters()
    attributes = _stringify({"property_id": property_id})
    _pricing_impact.record(delta_minor, attributes)
    tracked = dict(attributes)
    tracked["delta_minor"] = str(delta_minor)
    _track_metric("bmad_core_pricing_revenue_delta_minor", tracked)


def record_guest_message_delivery(channel: str, template: str) -> None:
    _ensure_counters()
    attributes = _stringify({"channel": channel, "template": template})
    _guest_messages_sent.add(1, attributes)
    _track_metric("bmad_core_guest_messages_sent_total", attributes)


def record_guest_message_failure(channel: str, template: str) -> None:
    _ensure_counters()
    attributes = _stringify({"channel": channel, "template": template})
    _guest_messages_failed.add(1, attributes)
    _track_metric("bmad_core_guest_messages_failed_total", attributes)


def record_guest_message_latency(channel: str, latency_minutes: float) -> None:
    _ensure_counters()
    attributes = _stringify({"channel": channel})
    _guest_message_latency.record(latency_minutes, attributes)
    _track_metric(
        "bmad_core_guest_message_response_time_minutes",
        {"channel": channel, "latency_minutes": f"{latency_minutes:.2f}"},
    )


def record_guest_satisfaction(score: float, *, touchpoint: str | None = None) -> None:
    _ensure_counters()
    attributes = _stringify({"touchpoint": touchpoint or "unknown"})
    _guest_satisfaction.record(score, attributes)
    _track_metric(
        "bmad_core_guest_satisfaction_score",
        {"touchpoint": touchpoint or "unknown", "score": f"{score:.2f}"},
    )


def record_guest_preference_sync(stage: str | None = None) -> None:
    _ensure_counters()
    attributes = _stringify({"stage": stage or "unspecified"})
    _guest_preference_sync.add(1, attributes)
    _track_metric(
        "bmad_core_guest_preference_sync_total",
        {"stage": stage or "unspecified"},
    )


def record_dashboard_guest_experience(metric: str, value: float) -> None:
    _ensure_counters()
    _track_metric(
        "bmad_core_dashboard_guest_experience",
        {"metric": metric, "value": f"{value:.4f}"},
    )
