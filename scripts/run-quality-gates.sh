#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ARTIFACT_DIR="$ROOT_DIR/artifacts"
SECURITY_DIR="$ARTIFACT_DIR/security"
OBSERVABILITY_DIR="$ARTIFACT_DIR/observability"
COVERAGE_DIR="$ARTIFACT_DIR/coverage"
QA_EVIDENCE_DIR="$ROOT_DIR/docs/evidencias/qa"
COMPLIANCE_DIR="$ROOT_DIR/docs/evidencias/compliance"
SECURITY_EVIDENCE_DIR="$ROOT_DIR/docs/evidencias/security"
mkdir -p "$SECURITY_DIR"
mkdir -p "$OBSERVABILITY_DIR"

declare -A REQUIRED_ARTIFACTS=(
  ["$COVERAGE_DIR/unit-coverage.xml"]="Execute ./scripts/test-unit.sh para gerar a cobertura Python."
  ["$COVERAGE_DIR/integration-coverage.xml"]="Execute ./scripts/test-integration.sh para gerar a cobertura de integração."
  ["$COVERAGE_DIR/web-coverage.xml"]="Execute ./scripts/test-unit.sh para gerar a cobertura do frontend."
  ["$COVERAGE_DIR/api-client-coverage.xml"]="Execute ./scripts/test-unit.sh para gerar a cobertura do pacote API client."
  ["$QA_EVIDENCE_DIR/bug-dashboard.json"]="Atualize docs/evidencias/qa/bug-dashboard.json com o dashboard exportado do Jira."
  ["$SECURITY_DIR/bandit-report.json"]="Execute ./scripts/run-quality-gates.sh para gerar o relatório do Bandit."
  ["$SECURITY_DIR/npm-audit-web.json"]="Execute ./scripts/run-quality-gates.sh para gerar o relatório do npm audit do workspace web."
  ["$SECURITY_DIR/npm-audit-api-client.json"]="Execute ./scripts/run-quality-gates.sh para gerar o relatório do npm audit do API client."
  ["$SECURITY_DIR/pip-audit.json"]="Execute ./scripts/run-quality-gates.sh para gerar o relatório do pip-audit."
  ["$SECURITY_EVIDENCE_DIR/dast-scan-status.json"]="Atualize docs/evidencias/security/dast-scan-status.json com o último scan aprovado."
  ["$COMPLIANCE_DIR/privacy-readiness.yaml"]="Garanta que docs/evidencias/compliance/privacy-readiness.yaml esteja versionado com o último checklist aprovado."
)

for path in "${!REQUIRED_ARTIFACTS[@]}"; do
  if [[ ! -f "$path" ]]; then
    echo "[quality-gates] Aviso: artefato ausente: $path. ${REQUIRED_ARTIFACTS[$path]}" >&2
  fi
done

if command -v bandit >/dev/null 2>&1; then
  echo "[quality-gates] Executando bandit"
  bandit -q -r "$ROOT_DIR/quality" --severity-level medium --confidence-level medium -f json -o "$SECURITY_DIR/bandit-report.json"
else
  echo "[quality-gates] Bandit não disponível" >&2
  exit 1
fi

if command -v npm >/dev/null 2>&1; then
  echo "[quality-gates] Executando npm audit nas aplicações web"
  npm audit --workspace @bmad/web --json > "$SECURITY_DIR/npm-audit-web.json" || true
  npm audit --workspace @bmad/api-client --json > "$SECURITY_DIR/npm-audit-api-client.json" || true
else
  echo "[quality-gates] npm não disponível; auditoria de dependências JavaScript não executada." >&2
fi

if command -v pip-audit >/dev/null 2>&1; then
  echo "[quality-gates] Executando pip-audit"
  pip-audit --requirement "$ROOT_DIR/requirements.txt" --format json --output "$SECURITY_DIR/pip-audit.json" || true
else
  echo "[quality-gates] pip-audit não disponível" >&2
fi

python3.14 "$ROOT_DIR/scripts/verify_quality_gates.py"
python3.14 "$ROOT_DIR/scripts/verify_observability_gates.py" --artifact-dir "$OBSERVABILITY_DIR"

echo "[quality-gates] Executando Great Expectations"
python3.14 "$ROOT_DIR/scripts/validate_data_quality.py"
