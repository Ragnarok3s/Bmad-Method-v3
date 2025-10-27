#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

run_node_tests() {
  local package_dir="$1"
  if [ -f "$package_dir/package.json" ]; then
    echo "[test-unit] Executando testes do Node.js em $package_dir"
    (cd "$package_dir" && npm test)
    return 0
  fi
  return 1
}

run_python_tests() {
  if compgen -G "$ROOT_DIR/**/pytest.ini" > /dev/null || compgen -G "$ROOT_DIR/**/pyproject.toml" > /dev/null; then
    echo "[test-unit] Executando pytest a partir da raiz do repositório"
    (cd "$ROOT_DIR" && pytest)
    return 0
  fi
  return 1
}

main() {
  echo "[test-unit] Iniciando suíte de testes unitários"

  if run_node_tests "$ROOT_DIR"; then
    exit 0
  fi

  if run_node_tests "$ROOT_DIR/web-bundles"; then
    exit 0
  fi

  if run_python_tests; then
    exit 0
  fi

  echo "[test-unit] Nenhuma suíte de testes detectada. Adicione testes unitários apropriados." >&2
}

main "$@"
