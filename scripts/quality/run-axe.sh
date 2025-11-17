#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP_DIR="$ROOT_DIR/frontend"
OUTPUT_DIR="$ROOT_DIR/backend/quality/reports/a11y"
PORT="${AXE_PORT:-3100}"
HOST="127.0.0.1"
BASE_URL="http://${HOST}:${PORT}"
LOG_FILE="$(mktemp)"

mkdir -p "$OUTPUT_DIR"

echo "[axe] Construindo aplicação Next.js"
pushd "$APP_DIR" >/dev/null
npm run build >/dev/null 2>&1

echo "[axe] Iniciando servidor de pré-visualização em ${BASE_URL}"
HOST=$HOST PORT=$PORT npm run start -- --hostname $HOST --port $PORT >"$LOG_FILE" 2>&1 &
SERVER_PID=$!
popd >/dev/null

cleanup() {
  if [[ -n "${SERVER_PID:-}" ]]; then
    kill "$SERVER_PID" >/dev/null 2>&1 || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
  rm -f "$LOG_FILE"
}
trap cleanup EXIT

for attempt in {1..30}; do
  if curl -sf "${BASE_URL}/" >/dev/null 2>&1; then
    break
  fi
  sleep 1
  if [[ $attempt -eq 30 ]]; then
    echo "[axe] Falha ao iniciar servidor Next.js" >&2
    tail -n 50 "$LOG_FILE" >&2 || true
    exit 1
  fi
done

echo "[axe] Executando auditoria axe-core"
REPORT_PATH="$OUTPUT_DIR/axe-audit.json"
PAGE_LIST=("${BASE_URL}/" "${BASE_URL}/agents" "${BASE_URL}/knowledge-base")

npx @axe-core/cli "${PAGE_LIST[@]}" --timeout 60000 --save "$REPORT_PATH"

echo "[axe] Relatório salvo em $REPORT_PATH"
