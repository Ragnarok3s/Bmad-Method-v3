#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ARTIFACT_DIR="$ROOT_DIR/artifacts"
JUNIT_DIR="$ARTIFACT_DIR/junit"

mkdir -p "$JUNIT_DIR"

run_pytest_e2e() {
  if compgen -G "$ROOT_DIR/tests/e2e/*.py" > /dev/null; then
    echo "[test-e2e] Executando pytest -m e2e"
    (\
      cd "$ROOT_DIR" && \
      pytest \
        -m e2e \
        --junitxml="$JUNIT_DIR/e2e-tests.xml"
    )
    return 0
  fi
  return 1
}

main() {
  echo "[test-e2e] Iniciando suíte de testes E2E"

  if run_pytest_e2e; then
    exit 0
  fi

  echo "[test-e2e] Nenhuma suíte E2E configurada. Adicione cenários ponta a ponta." >&2
  exit 1
}

main "$@"
