#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ARTIFACT_DIR="$ROOT_DIR/artifacts"
SECURITY_DIR="$ARTIFACT_DIR/security"
OBSERVABILITY_DIR="$ARTIFACT_DIR/observability"
mkdir -p "$SECURITY_DIR"
mkdir -p "$OBSERVABILITY_DIR"

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

python3 "$ROOT_DIR/scripts/verify_quality_gates.py"
python3 "$ROOT_DIR/scripts/verify_observability_gates.py" --artifact-dir "$OBSERVABILITY_DIR"

echo "[quality-gates] Executando Great Expectations"
python3 "$ROOT_DIR/scripts/validate_data_quality.py"
