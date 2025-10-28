#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ARTIFACT_DIR="$ROOT_DIR/artifacts"
COVERAGE_DIR="$ARTIFACT_DIR/coverage"
JUNIT_DIR="$ARTIFACT_DIR/junit"

mkdir -p "$COVERAGE_DIR" "$JUNIT_DIR"

run_pytest_integration() {
  if compgen -G "$ROOT_DIR/tests/integration/*.py" > /dev/null; then
    echo "[test-integration] Executando pytest -m integration"
    export COVERAGE_FILE="$COVERAGE_DIR/.coverage.integration"
    (\
      cd "$ROOT_DIR" && \
      pytest \
        -m integration \
        --cov=quality.privacy \
        --cov-report=xml:"$COVERAGE_DIR/integration-coverage.xml" \
        --cov-report=term \
        --junitxml="$JUNIT_DIR/integration-tests.xml"
    )
    return 0
  fi
  return 1
}

main() {
  echo "[test-integration] Iniciando suíte de testes de integração"

  if run_pytest_integration; then
    exit 0
  fi

  echo "[test-integration] Nenhuma suíte de integração detectada. Configure scripts adequados para habilitar validações automatizadas." >&2
  exit 1
}

main "$@"
