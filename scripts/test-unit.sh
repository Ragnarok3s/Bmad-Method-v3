#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ARTIFACT_DIR="$ROOT_DIR/artifacts"
COVERAGE_DIR="$ARTIFACT_DIR/coverage"
JUNIT_DIR="$ARTIFACT_DIR/junit"

mkdir -p "$COVERAGE_DIR" "$JUNIT_DIR"

run_pytest_unit() {
  if compgen -G "$ROOT_DIR/tests/**/*.py" > /dev/null; then
    echo "[test-unit] Executando pytest com cobertura"
    export COVERAGE_FILE="$COVERAGE_DIR/.coverage.unit"
    (\
      cd "$ROOT_DIR" && \
      pytest \
        -m "not integration and not e2e" \
        --cov=quality.metrics \
        --cov-report=xml:"$COVERAGE_DIR/unit-coverage.xml" \
        --cov-report=term-missing \
        --junitxml="$JUNIT_DIR/unit-tests.xml"
    )
    return 0
  fi
  return 1
}

main() {
  echo "[test-unit] Iniciando suíte de testes unitários"

  if run_pytest_unit; then
    exit 0
  fi

  echo "[test-unit] Nenhuma suíte de testes detectada. Adicione testes unitários apropriados." >&2
  exit 1
}

main "$@"
