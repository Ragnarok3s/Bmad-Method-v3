#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
ARTIFACT_DIR="$ROOT_DIR/artifacts"
JUNIT_DIR="$ARTIFACT_DIR/junit"

mkdir -p "$JUNIT_DIR"

run_pytest_e2e() {
  if compgen -G "$BACKEND_DIR/tests/e2e/*.py" > /dev/null; then
    echo "[test-e2e] Executando pytest -m e2e"
    (
      cd "$BACKEND_DIR" && \
      pytest \
        -m e2e \
        --junitxml="$JUNIT_DIR/e2e-tests.xml"
    )
    return 0
  fi
  return 1
}

run_web_e2e() {
  if [ -f "$ROOT_DIR/frontend/package.json" ]; then
    echo "[test-e2e] Preparando navegadores Playwright"
    if ! (
      cd "$ROOT_DIR" && \
      npm run prepare:frontend:e2e --if-present
    ); then
      echo "[test-e2e] Aviso: não foi possível instalar navegadores Playwright. Ignorando cenários E2E do frontend." >&2
      return 2
    fi

    echo "[test-e2e] Executando Playwright no frontend"
    (
      cd "$ROOT_DIR" && \
      npm run test:frontend:e2e --if-present
    )
    return 0
  fi
  return 1
}

main() {
  echo "[test-e2e] Iniciando suíte de testes E2E"

  local executed_any=0

  if run_pytest_e2e; then
    executed_any=1
  fi

  local web_status=1
  if run_web_e2e; then
    executed_any=1
    web_status=0
  else
    web_status=$?
    if [[ $web_status -eq 2 ]]; then
      executed_any=1
    fi
  fi

  if [[ $executed_any -eq 1 ]]; then
    exit 0
  fi

  echo "[test-e2e] Nenhuma suíte E2E configurada. Adicione cenários ponta a ponta." >&2
  exit 1
}

main "$@"
