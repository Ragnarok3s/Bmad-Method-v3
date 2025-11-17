from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parents[2]


def _load_yaml(path: Path):
    with path.open(encoding="utf-8") as handle:
        return yaml.safe_load(handle)


def test_staging_alert_thresholds():
    data = _load_yaml(REPO_ROOT / "grafana/alerts/staging.yaml")
    rules = data["groups"][0]["rules"]
    thresholds = {rule["title"]: rule for rule in rules}

    error_rule = thresholds["PlaybookErrorRate"]
    exprs = {item["refId"]: item for item in error_rule["data"]}
    assert "0.015" in exprs["C"]["expression"], "Erro crítico deve disparar com 1.5%"

    pipeline_rule = thresholds["PipelineFailureBurst"]
    assert ">= 2" in pipeline_rule["data"][1]["expression"], "PipelineBurst deve vigiar 2 falhas"

    engagement_rule = thresholds["EngagementDrop"]
    assert "0.7" in engagement_rule["data"][2]["expression"], "Queda deve ser de 30%"

    availability_rule = thresholds["AvailabilityDrop"]
    expr_lookup = {item["refId"]: item["expression"] for item in availability_rule["data"] if item.get("expression")}
    assert "0.995" in expr_lookup["D"], "Disponibilidade crítica deve ser 99.5%"


def test_qa_gate_alert_runbook_url():
    data = _load_yaml(REPO_ROOT / "grafana/alerts/qa-observability.yaml")
    rules = data["groups"][0]["rules"]
    rule = rules[0]
    assert "qa-gates.md" in rule["annotations"]["runbook_url"], "Runbook QA deve apontar para documentação atualizada"
    assert rule["labels"]["severity"] == "critical"
