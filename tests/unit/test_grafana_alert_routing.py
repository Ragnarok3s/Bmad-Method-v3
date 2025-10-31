"""Garantir que o roteamento de alertas críticos segue o runbook de incidentes."""

from __future__ import annotations

from pathlib import Path

import yaml

ALERTS_PATH = Path(__file__).resolve().parents[2] / "grafana/alerts/staging.yaml"


def _load_alerts() -> dict:
    return yaml.safe_load(ALERTS_PATH.read_text(encoding="utf-8"))


def test_staging_receiver_routes_to_slack_and_pagerduty() -> None:
    data = _load_alerts()
    receivers = {receiver["name"]: receiver for receiver in data.get("receivers", [])}
    assert "staging-critical" in receivers, "Receiver staging-critical deve existir"

    receiver = receivers["staging-critical"]
    slack_channels = {cfg["channel"] for cfg in receiver.get("slack_configs", [])}
    assert "#incident" in slack_channels, "Canal Slack #incident deve receber alertas críticos"

    pagerduty_keys = {cfg["service_key"] for cfg in receiver.get("pagerduty_configs", [])}
    assert (
        "{{ pagerduty.BmadPlatformStaging }}" in pagerduty_keys
    ), "PagerDuty BmadPlatformStaging deve receber alertas críticos"


def test_all_routes_point_to_staging_critical_receiver() -> None:
    data = _load_alerts()
    policies = data.get("policies", [])
    matching_policies = [policy for policy in policies if policy.get("receiver") == "staging-critical"]
    assert matching_policies, "Policy principal deve usar receiver staging-critical"

    for policy in matching_policies:
        for route in policy.get("routes", []):
            assert (
                route.get("receiver") == "staging-critical"
            ), f"Rotas secundárias devem encaminhar para staging-critical (rota atual: {route})"


def test_rules_reference_runbook() -> None:
    data = _load_alerts()
    groups = data.get("groups", [])
    runbook_url = "https://github.com/bmad-method/Bmad-Method-v3/blob/main/docs/runbooks/alertas-criticos.md"

    missing_runbook: list[str] = []
    for group in groups:
        for rule in group.get("rules", []):
            if rule.get("title") in {"PlaybookErrorRate", "PipelineFailureBurst", "EngagementDrop"}:
                annotations = rule.get("annotations", {})
                if annotations.get("runbook_url") != runbook_url:
                    missing_runbook.append(rule.get("title"))

    assert not missing_runbook, f"Regras sem runbook correto: {missing_runbook}"
