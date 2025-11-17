#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
ARTIFACT_DIR="$ROOT_DIR/artifacts"
COVERAGE_DIR="$ARTIFACT_DIR/coverage"
JUNIT_DIR="$ARTIFACT_DIR/junit"

mkdir -p "$COVERAGE_DIR" "$JUNIT_DIR"

run_suite() {
  local marker="$1"
  local name="$2"

  echo "[test-domain] Executando suíte ${marker}" >&2
  export COVERAGE_FILE="$COVERAGE_DIR/.coverage.${name}"
  (
    cd "$BACKEND_DIR" && \
    pytest \
      -m "$marker" \
      --maxfail=1 \
      --cov=services.core \
      --cov-report=xml:"$COVERAGE_DIR/${name}-coverage.xml" \
      --cov-report=term \
      --junitxml="$JUNIT_DIR/${name}.xml"
  )
}

main() {
  echo "[test-domain] Iniciando suites críticas (reservations, payments, ota)" >&2
  run_suite "reservations" "reservations"
  run_suite "payments" "payments"
  run_suite "ota" "ota"
  echo "[test-domain] Suítes concluídas com sucesso" >&2
}

main "$@"
