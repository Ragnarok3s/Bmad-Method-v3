#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

has_npm_integration_script() {
  local package_json="$1/package.json"
  if [ ! -f "$package_json" ]; then
    return 1
  fi

  local script_name
  script_name=$(python3 - <<'PY'
import json, pathlib, sys
path = pathlib.Path(sys.argv[1])
try:
    data = json.loads(path.read_text())
except FileNotFoundError:
    sys.exit(1)
print(data.get("scripts", {}).get("test:integration", ""))
PY
"$package_json") || return 1

  if [ -n "$script_name" ]; then
    return 0
  fi
  return 1
}

run_node_integration() {
  local package_dir="$1"
  if has_npm_integration_script "$package_dir"; then
    echo "[test-integration] Executando npm run test:integration em $package_dir"
    (cd "$package_dir" && npm run test:integration)
    return 0
  fi
  return 1
}

run_python_integration() {
  if command -v pytest >/dev/null 2>&1; then
    if compgen -G "$ROOT_DIR/tests/integration/*.py" > /dev/null; then
      echo "[test-integration] Executando pytest com marcador integration"
      (cd "$ROOT_DIR" && pytest -m integration)
      return 0
    fi
  fi
  return 1
}

main() {
  echo "[test-integration] Iniciando suíte de testes de integração"

  if run_node_integration "$ROOT_DIR"; then
    exit 0
  fi

  if run_node_integration "$ROOT_DIR/web-bundles"; then
    exit 0
  fi

  if run_python_integration; then
    exit 0
  fi

  echo "[test-integration] Nenhuma suíte de integração detectada. Configure scripts adequados para habilitar validações automatizadas." >&2
}

main "$@"
