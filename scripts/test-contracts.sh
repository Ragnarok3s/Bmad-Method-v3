#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ARTIFACT_DIR="$ROOT_DIR/artifacts/contracts"
PACT_OUTPUT="$ARTIFACT_DIR/pacts"
JUNIT_DIR="$ROOT_DIR/artifacts/junit"

mkdir -p "$ARTIFACT_DIR" "$PACT_OUTPUT" "$JUNIT_DIR"

echo "[contracts] Executando suíte de contratos Pact"
(
  cd "$ROOT_DIR"
  pytest tests/contracts --junitxml="$JUNIT_DIR/contracts-tests.xml"
)

SOURCE_PACTS="$ROOT_DIR/tests/contracts/pacts"
if [ -d "$SOURCE_PACTS" ]; then
  echo "[contracts] Publicando pacts em $PACT_OUTPUT"
  rm -rf "$PACT_OUTPUT"
  mkdir -p "$PACT_OUTPUT"
  cp -R "$SOURCE_PACTS/." "$PACT_OUTPUT/"
fi

echo "[contracts] Concluído"
