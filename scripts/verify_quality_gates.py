"""Valida gates de qualidade definidos na estratégia de testes."""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any
from xml.etree import ElementTree as ET

import yaml

REPO_ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS = REPO_ROOT / "artifacts"
COVERAGE_DIR = ARTIFACTS / "coverage"
SECURITY_DIR = ARTIFACTS / "security"
COMPLIANCE_DIR = REPO_ROOT / "docs" / "evidencias" / "compliance"
QA_DIR = REPO_ROOT / "docs" / "evidencias" / "qa"
SECURITY_EVIDENCE_DIR = REPO_ROOT / "docs" / "evidencias" / "security"


class QualityGateError(RuntimeError):
    """Erro lançado quando um gate obrigatório falha."""


def _require_artifact(path: Path, hint: str) -> Path:
    if not path.exists():
        raise QualityGateError(f"Artefato obrigatório ausente: {path}. {hint}")
    return path


def _load_coverage(path: Path, hint: str) -> float:
    target = _require_artifact(path, hint)
    tree = ET.parse(target)
    root = tree.getroot()
    return float(root.get("line-rate", "0")) * 100


def validate_python_coverage() -> None:
    unit = _load_coverage(
        COVERAGE_DIR / "unit-coverage.xml",
        "Execute ./scripts/test-unit.sh para gerar a cobertura Python.",
    )
    integration = _load_coverage(
        COVERAGE_DIR / "integration-coverage.xml",
        "Execute ./scripts/test-integration.sh para gerar a cobertura de integração.",
    )
    if unit < 75:
        raise QualityGateError(f"Cobertura unitária abaixo do mínimo: {unit:.2f}% < 75%")
    if integration < 45:
        raise QualityGateError(
            f"Cobertura de integração abaixo do mínimo: {integration:.2f}% < 45%"
        )


def validate_frontend_coverage() -> None:
    web = _load_coverage(
        COVERAGE_DIR / "web-coverage.xml",
        "Execute ./scripts/test-unit.sh para publicar a cobertura do frontend.",
    )
    if web < 70:
        raise QualityGateError(
            f"Cobertura do frontend abaixo do mínimo: {web:.2f}% < 70%"
        )

    api_client = _load_coverage(
        COVERAGE_DIR / "api-client-coverage.xml",
        "Execute ./scripts/test-unit.sh para gerar a cobertura do pacote API client.",
    )
    if api_client < 20:
        raise QualityGateError(
            f"Cobertura do pacote API client abaixo do mínimo: {api_client:.2f}% < 20%"
        )


def validate_bug_backlog() -> None:
    backlog_path = QA_DIR / "bug-dashboard.json"
    data = json.loads(
        _require_artifact(
            backlog_path,
            "Atualize docs/evidencias/qa/bug-dashboard.json com o dashboard exportado do Jira.",
        ).read_text(encoding="utf-8")
    )
    if data["critical_open"] != 0:
        raise QualityGateError("Existem bugs críticos abertos")
    if data["high_open"] > 5:
        raise QualityGateError("Limite de bugs altos excedido")


def validate_bandit_report() -> None:
    report = json.loads(
        _require_artifact(
            SECURITY_DIR / "bandit-report.json",
            "Execute ./scripts/run-quality-gates.sh para gerar o relatório do Bandit.",
        ).read_text(encoding="utf-8")
    )
    high_issues = [issue for issue in report.get("results", []) if issue.get("issue_severity") == "HIGH"]
    if high_issues:
        raise QualityGateError("Bandit encontrou vulnerabilidades de severidade alta")


def _load_json(path: Path, hint: str) -> dict[str, Any]:
    data = json.loads(_require_artifact(path, hint).read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise QualityGateError(f"Formato inesperado em {path}")
    return data


def validate_npm_audit() -> None:
    audits = {
        "web": SECURITY_DIR / "npm-audit-web.json",
        "api-client": SECURITY_DIR / "npm-audit-api-client.json",
    }
    for workspace, path in audits.items():
        data = _load_json(
            path,
            "Execute ./scripts/run-quality-gates.sh para gerar os relatórios do npm audit.",
        )
        metadata = data.get("metadata", {})
        vulnerabilities = metadata.get("vulnerabilities", {})
        critical = int(vulnerabilities.get("critical", 0))
        high = int(vulnerabilities.get("high", 0))
        if critical or high:
            raise QualityGateError(
                f"npm audit encontrou {critical} críticas e {high} altas em {workspace}"
            )


def validate_pip_audit() -> None:
    path = SECURITY_DIR / "pip-audit.json"
    raw = json.loads(
        _require_artifact(
            path,
            "Execute ./scripts/run-quality-gates.sh para gerar o relatório do pip-audit.",
        ).read_text(encoding="utf-8")
    )

    if isinstance(raw, dict):
        entries = raw.get("dependencies")
        if not isinstance(entries, list):
            raise QualityGateError("Formato inesperado no resultado do pip-audit")
    elif isinstance(raw, list):
        entries = raw
    else:
        raise QualityGateError("Formato inesperado no resultado do pip-audit")

    offenders: list[str] = []
    for entry in entries:
        if not isinstance(entry, dict):
            continue
        package = entry.get("name", "desconhecido")
        for vuln in entry.get("vulns", []) or []:
            severity = (vuln.get("severity") or "").upper()
            if severity in {"HIGH", "CRITICAL"}:
                identifier = (
                    vuln.get("id") or vuln.get("cve") or ",".join(vuln.get("aliases", []))
                    or "vulnerabilidade"
                )
                offenders.append(f"{package}:{identifier}:{severity}")
    if offenders:
        raise QualityGateError(
            "pip-audit encontrou vulnerabilidades críticas/altas: " + ", ".join(offenders)
        )


def validate_dast_status() -> None:
    status_path = SECURITY_EVIDENCE_DIR / "dast-scan-status.json"
    data = json.loads(
        _require_artifact(
            status_path,
            "Atualize docs/evidencias/security/dast-scan-status.json com o último resultado aprovado.",
        ).read_text(encoding="utf-8")
    )
    if data.get("last_scan_status") != "passed":
        raise QualityGateError("Último scan DAST não foi aprovado")


def validate_privacy_matrix() -> None:
    matrix = yaml.safe_load(
        _require_artifact(
            COMPLIANCE_DIR / "privacy-readiness.yaml",
            "Garanta que docs/evidencias/compliance/privacy-readiness.yaml esteja versionado com o último checklist aprovado.",
        ).read_text(encoding="utf-8")
    )
    statuses = {entry["status"] for entry in matrix.get("controles", [])}
    if statuses - {"aprovado"}:
        raise QualityGateError("Nem todos os controles de privacidade estão aprovados")


def main() -> None:
    validators = [
        validate_python_coverage,
        validate_frontend_coverage,
        validate_bug_backlog,
        validate_bandit_report,
        validate_npm_audit,
        validate_pip_audit,
        validate_dast_status,
        validate_privacy_matrix,
    ]
    for validator in validators:
        validator()
    print("Quality gates aprovados.")


if __name__ == "__main__":
    try:
        main()
    except QualityGateError as exc:
        print(f"[quality-gates] Falha: {exc}", file=sys.stderr)
        sys.exit(1)
