#!/usr/bin/env python3
"""Valida ativos de observabilidade e gera artefactos para o pipeline."""

from __future__ import annotations

import argparse
import json
import shutil
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

import yaml


REPO_ROOT = Path(__file__).resolve().parent.parent


@dataclass
class FileExpectation:
    path: Path
    required_tokens: Iterable[str]


DASHBOARDS = [
    FileExpectation(
        REPO_ROOT / "grafana/staging/bmad-agents-001.json",
        ["http_server_duration_bucket", "http_server_duration_count"],
    ),
    FileExpectation(
        REPO_ROOT / "grafana/staging/bmad-ops-002.json",
        [
            "bmad_core_reservations_confirmed_total",
            "bmad_core_housekeeping_tasks_scheduled_total",
            "bmad_web_page_view_total",
        ],
    ),
]

ALERTS = [
    FileExpectation(
        REPO_ROOT / "grafana/alerts/staging.yaml",
        ["PlaybookErrorRate", "PipelineFailureBurst", "EngagementDrop"],
    )
]

RUNBOOK = REPO_ROOT / "docs/runbooks/observabilidade-servicos.md"
RUNBOOK_TOKENS = ["## Checklist Diário", "## Procedimento em Caso de Falha"]


def _validate_tokens(file_path: Path, tokens: Iterable[str]) -> list[str]:
    content = file_path.read_text(encoding="utf-8")
    missing = [token for token in tokens if token not in content]
    return missing


def _copy_to_artifact(file_path: Path, destination_dir: Path) -> str:
    destination_dir.mkdir(parents=True, exist_ok=True)
    target = destination_dir / file_path.name
    shutil.copy(file_path, target)
    return str(target.relative_to(destination_dir))


def _load_alert_rule_names(file_path: Path) -> set[str]:
    data = yaml.safe_load(file_path.read_text(encoding="utf-8"))
    rule_names: set[str] = set()
    for group in data.get("groups", []):
        for rule in group.get("rules", []):
            if name := rule.get("name"):
                rule_names.add(str(name))
    return rule_names


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--artifact-dir", required=True)
    args = parser.parse_args()

    artifact_dir = Path(args.artifact_dir)
    artifact_dir.mkdir(parents=True, exist_ok=True)
    observability_dir = artifact_dir

    manifest: dict[str, object] = {
        "status": "passed",
        "dashboards": [],
        "alerts": [],
        "runbook": {},
    }
    log_lines: list[str] = []
    errors: list[str] = []

    for expectation in DASHBOARDS:
        entry: dict[str, object] = {"file": str(expectation.path.relative_to(REPO_ROOT))}
        if not expectation.path.exists():
            errors.append(f"Dashboard ausente: {expectation.path}")
            entry["status"] = "missing"
        else:
            missing = _validate_tokens(expectation.path, expectation.required_tokens)
            entry["status"] = "ok" if not missing else "invalid"
            entry["missingTokens"] = missing
            copied = _copy_to_artifact(expectation.path, observability_dir)
            entry["artifact"] = copied
            if missing:
                errors.append(
                    f"Dashboard {expectation.path.name} sem métricas esperadas: {', '.join(missing)}"
                )
        manifest["dashboards"].append(entry)

    for expectation in ALERTS:
        entry = {"file": str(expectation.path.relative_to(REPO_ROOT))}
        if not expectation.path.exists():
            errors.append(f"Arquivo de alertas ausente: {expectation.path}")
            entry["status"] = "missing"
        else:
            missing = _validate_tokens(expectation.path, expectation.required_tokens)
            rule_names = _load_alert_rule_names(expectation.path)
            entry["status"] = "ok" if not missing else "invalid"
            entry["missingTokens"] = missing
            entry["rules"] = sorted(rule_names)
            copied = _copy_to_artifact(expectation.path, observability_dir)
            entry["artifact"] = copied
            if missing:
                errors.append(
                    f"Alertas sem nomes esperados em {expectation.path.name}: {', '.join(missing)}"
                )
        manifest["alerts"].append(entry)

    runbook_entry: dict[str, object] = {"file": str(RUNBOOK.relative_to(REPO_ROOT))}
    if not RUNBOOK.exists():
        errors.append("Runbook de observabilidade ausente.")
        runbook_entry["status"] = "missing"
    else:
        missing = _validate_tokens(RUNBOOK, RUNBOOK_TOKENS)
        runbook_entry["status"] = "ok" if not missing else "invalid"
        runbook_entry["missingTokens"] = missing
        copied = _copy_to_artifact(RUNBOOK, observability_dir)
        runbook_entry["artifact"] = copied
        if missing:
            errors.append(
                "Runbook observabilidade sem secções obrigatórias: " + ", ".join(missing)
            )
    manifest["runbook"] = runbook_entry

    manifest_path = observability_dir / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    log_lines.append("[observability] arquivos analisados: %s" % len(DASHBOARDS + ALERTS))
    if errors:
        manifest["status"] = "failed"
        log_lines.extend(errors)
    else:
        log_lines.append("[observability] todos os requisitos atendidos")

    log_path = observability_dir / "otel-health.log"
    log_path.write_text("\n".join(log_lines) + "\n", encoding="utf-8")

    if errors:
        raise SystemExit("Observability gates falharam: " + "; ".join(errors))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:  # pragma: no cover - logar falha inesperada
        print(f"[observability] erro não tratado: {exc}", file=sys.stderr)
        raise
