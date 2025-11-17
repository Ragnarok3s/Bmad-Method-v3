#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
ARTIFACT_DIR="$ROOT_DIR/artifacts"
COVERAGE_DIR="$ARTIFACT_DIR/coverage"
JUNIT_DIR="$ARTIFACT_DIR/junit"

mkdir -p "$COVERAGE_DIR" "$JUNIT_DIR"

run_pytest_unit() {
  if find "$BACKEND_DIR/tests" -type f -name "*.py" -print -quit 2>/dev/null | grep -q '.'; then
    echo "[test-unit] Executando pytest com cobertura"
    export COVERAGE_FILE="$COVERAGE_DIR/.coverage.unit"
    (
      cd "$BACKEND_DIR" && \
      pytest \
        -m "not integration and not e2e" \
        --cov=services.core \
        --cov=services.identity \
        --cov=services.payments \
        --cov=services.property \
        --cov=quality.metrics \
        --cov-report=xml:"$COVERAGE_DIR/unit-coverage.xml" \
        --cov-report=term-missing \
        --junitxml="$JUNIT_DIR/unit-tests.xml"
    )
    return 0
  fi
  return 1
}

run_api_client_unit() {
  if [ -f "$ROOT_DIR/packages/api-client/package.json" ]; then
    echo "[test-unit] Executando testes do pacote API client"
    local coverage_output="$COVERAGE_DIR/api-client"
    mkdir -p "$coverage_output"
    (
      cd "$ROOT_DIR" && \
      npm run test --workspace @bmad/api-client -- \
        --coverage \
        --coverage.reporter=cobertura \
        --coverage.reporter=text \
        --coverage.reports-directory=../../artifacts/coverage/api-client
    )
    if [ -f "$coverage_output/cobertura-coverage.xml" ]; then
      cp "$coverage_output/cobertura-coverage.xml" "$COVERAGE_DIR/api-client-coverage.xml"
    fi
    return 0
  fi
  return 1
}

run_web_unit() {
  if [ -f "$ROOT_DIR/frontend/package.json" ]; then
    echo "[test-unit] Executando testes unitários do frontend"
    (
      cd "$ROOT_DIR" && \
      CI=1 npm run test --workspace @bmad/web -- \
        --coverage \
        --coverageReporters=cobertura \
        --coverageReporters=text \
        --coverageDirectory=../artifacts/coverage/web \
        --runInBand
    )
    local coverage_output="$COVERAGE_DIR/web"
    mkdir -p "$coverage_output"
    if [ -f "$coverage_output/cobertura-coverage.xml" ]; then
      cp "$coverage_output/cobertura-coverage.xml" "$COVERAGE_DIR/web-coverage.xml"
    fi
    return 0
  fi
  return 1
}

main() {
  echo "[test-unit] Iniciando suíte de testes unitários"

  local executed_any=0

  if run_pytest_unit; then
    executed_any=1
  fi

  if run_api_client_unit; then
    executed_any=1
  fi

  if run_web_unit; then
    executed_any=1
  fi

  if [[ $executed_any -eq 1 ]]; then
    exit 0
  fi

  echo "[test-unit] Nenhuma suíte de testes detectada. Adicione testes unitários apropriados." >&2
  exit 1
}

main "$@"
