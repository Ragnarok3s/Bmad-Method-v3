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

python3 "$ROOT_DIR/scripts/verify_quality_gates.py"
python3 "$ROOT_DIR/scripts/verify_observability_gates.py" --artifact-dir "$OBSERVABILITY_DIR"
