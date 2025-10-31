#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Uso: seed-data.sh <ambiente> [opções]

Ambientes suportados: dev, staging

Opções:
  --mode <apply|validate>    Define se o script aplica o seed ou apenas valida os datasets (default: apply)
  --export-dir <path>        Diretório para armazenar evidências (default: artifacts/seed)
  -h, --help                 Exibe esta ajuda
USAGE
}

if [[ $# -lt 1 ]]; then
  echo "[seed-data] Ambiente não informado." >&2
  usage
  exit 1
fi

ENVIRONMENT="$1"
shift || true

case "$ENVIRONMENT" in
  dev|staging)
    ;;
  *)
    echo "[seed-data] Ambiente desconhecido: $ENVIRONMENT" >&2
    usage
    exit 1
    ;;
esac

MODE="apply"
EXPORT_DIR=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --mode)
      MODE="${2:-}"
      shift 2 || {
        echo "[seed-data] Valor ausente para --mode" >&2
        exit 1
      }
      ;;
    --export-dir)
      EXPORT_DIR="${2:-}"
      shift 2 || {
        echo "[seed-data] Valor ausente para --export-dir" >&2
        exit 1
      }
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "[seed-data] Parâmetro desconhecido: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ "$MODE" != "apply" && "$MODE" != "validate" ]]; then
  echo "[seed-data] Modo inválido: $MODE" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

RELATIONAL_DATASET="${REPO_ROOT}/tests/data/seed/guests_relational.csv"
NOSQL_DATASET="${REPO_ROOT}/tests/data/seed/guest_preferences.json"

if [[ -z "$EXPORT_DIR" ]]; then
  EXPORT_DIR="${REPO_ROOT}/artifacts/seed"
fi

mkdir -p "$EXPORT_DIR"

PYTHONPATH="$REPO_ROOT" python3.14 - <<PY
from __future__ import annotations

import csv
import json
import sys
from pathlib import Path

from quality.privacy import is_record_synthetic

relational_path = Path("$RELATIONAL_DATASET")
nosql_path = Path("$NOSQL_DATASET")

missing = [str(p) for p in (relational_path, nosql_path) if not p.exists()]
if missing:
    sys.stderr.write(f"[seed-data] Datasets ausentes: {', '.join(missing)}\n")
    sys.exit(1)

violations: list[str] = []
with relational_path.open("r", encoding="utf-8") as csv_file:
    reader = csv.DictReader(csv_file)
    for idx, row in enumerate(reader, start=1):
        if not is_record_synthetic(row):
            violations.append(f"guests_relational.csv linha {idx}")

with nosql_path.open("r", encoding="utf-8") as json_file:
    records = json.load(json_file)
    if not isinstance(records, list):
        sys.stderr.write("[seed-data] guest_preferences.json deve conter uma lista de objetos.\n")
        sys.exit(1)
    for idx, row in enumerate(records, start=1):
        if not isinstance(row, dict):
            violations.append(f"guest_preferences.json item {idx} não é um objeto")
            continue
        if not is_record_synthetic(row):
            violations.append(f"guest_preferences.json item {idx}")

if violations:
    sys.stderr.write("[seed-data] Violação de privacidade detectada em: " + ", ".join(violations) + "\n")
    sys.exit(1)
PY

REL_URL_VAR=""
NOSQL_URL_VAR=""
COLLECTION_NAME="guest_preferences"
TABLE_NAME="guests"

case "$ENVIRONMENT" in
  dev)
    REL_URL_VAR="DEV_RELATIONAL_URL"
    NOSQL_URL_VAR="DEV_NOSQL_URL"
    ;;
  staging)
    REL_URL_VAR="STAGING_RELATIONAL_URL"
    NOSQL_URL_VAR="STAGING_NOSQL_URL"
    ;;
esac

get_env_var() {
  local var_name="$1"
  if [[ -n "${!var_name-}" ]]; then
    printf '%s' "${!var_name}"
  else
    printf ''
  fi
}

RELATIONAL_URL="$(get_env_var "$REL_URL_VAR")"
NOSQL_URL="$(get_env_var "$NOSQL_URL_VAR")"

rel_status=0
nosql_status=0
rel_action="skipped"
nosql_action="skipped"

seed_relational() {
  if [[ -z "$RELATIONAL_URL" ]]; then
    echo "[seed-data][$ENVIRONMENT] Variável $REL_URL_VAR não definida; seed relacional não será executado." >&2
    return 1
  fi
  if ! command -v psql >/dev/null 2>&1; then
    echo "[seed-data][$ENVIRONMENT] psql não encontrado no PATH." >&2
    return 1
  fi

  echo "[seed-data][$ENVIRONMENT] Aplicando seed relacional em ${RELATIONAL_URL}."
  if ! psql "$RELATIONAL_URL" <<__SQL__; then
CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
  guest_id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  document TEXT,
  tax_id TEXT,
  created_at DATE NOT NULL,
  booking_source TEXT
);
TRUNCATE TABLE ${TABLE_NAME};
__SQL__
    return 1
  fi

  if ! psql "$RELATIONAL_URL" <<__COPY__; then
\copy ${TABLE_NAME} (guest_id, full_name, email, document, tax_id, created_at, booking_source)
  FROM '${RELATIONAL_DATASET}' WITH (FORMAT csv, HEADER true);
__COPY__
    return 1
  fi
}

seed_nosql() {
  if [[ -z "$NOSQL_URL" ]]; then
    echo "[seed-data][$ENVIRONMENT] Variável $NOSQL_URL_VAR não definida; seed NoSQL não será executado." >&2
    return 1
  fi

  if command -v mongoimport >/dev/null 2>&1; then
    echo "[seed-data][$ENVIRONMENT] Aplicando seed NoSQL via mongoimport para ${NOSQL_URL}."
    if ! mongoimport --uri "$NOSQL_URL" \
      --collection "$COLLECTION_NAME" \
      --drop \
      --file "$NOSQL_DATASET" \
      --jsonArray >/dev/null; then
      return 1
    fi
    return 0
  fi

  if command -v mongosh >/dev/null 2>&1; then
    echo "[seed-data][$ENVIRONMENT] Aplicando seed NoSQL via mongosh para ${NOSQL_URL}."
    if ! mongosh "$NOSQL_URL" --quiet <<__MONGOSH__; then
const fs = require('fs');
const path = '$NOSQL_DATASET'.toString();
const payload = JSON.parse(fs.readFileSync(path, 'utf-8'));
const collection = db.getCollection('${COLLECTION_NAME}');
collection.drop();
collection.insertMany(payload);
__MONGOSH__
      return 1
    fi
    return 0
  fi

  echo "[seed-data][$ENVIRONMENT] Nenhuma ferramenta NoSQL suportada encontrada (mongoimport/mongosh)." >&2
  return 1
}

if [[ "$MODE" == "apply" ]]; then
  if seed_relational; then
    rel_status=1
    rel_action="seeded"
  else
    rel_status=0
    rel_action="failed"
  fi

  if seed_nosql; then
    nosql_status=1
    nosql_action="seeded"
  else
    nosql_status=0
    nosql_action="failed"
  fi
else
  rel_status=1
  nosql_status=1
  rel_action="validated"
  nosql_action="validated"
  echo "[seed-data][$ENVIRONMENT] Modo validate: datasets verificados sem aplicar seed."
fi

timestamp="$(date +%s)"
metrics_file="${EXPORT_DIR}/${ENVIRONMENT}_seed.prom"
json_file="${EXPORT_DIR}/${ENVIRONMENT}_seed.json"

env_summary() {
  cat <<__SUMMARY__
{
  "environment": "$ENVIRONMENT",
  "mode": "$MODE",
  "timestamp": $timestamp,
  "relational": {
    "dataset": "${RELATIONAL_DATASET}",
    "status": "$rel_action",
    "url_var": "$REL_URL_VAR"
  },
  "nosql": {
    "dataset": "${NOSQL_DATASET}",
    "status": "$nosql_action",
    "url_var": "$NOSQL_URL_VAR"
  }
}
__SUMMARY__
}

cat > "${metrics_file}.tmp" <<__METRICS__
# HELP seed_job_success Indica sucesso (1) ou falha (0) na última execução do job de seed.
# TYPE seed_job_success gauge
seed_job_success{environment="$ENVIRONMENT", datastore="relational"} $rel_status
seed_job_success{environment="$ENVIRONMENT", datastore="nosql"} $nosql_status
# HELP seed_job_last_run_timestamp Epoch da última execução conhecida do job de seed.
# TYPE seed_job_last_run_timestamp gauge
seed_job_last_run_timestamp{environment="$ENVIRONMENT"} $timestamp
__METRICS__

mv "${metrics_file}.tmp" "$metrics_file"

env_summary > "${json_file}.tmp"
mv "${json_file}.tmp" "$json_file"

overall_status=0
if [[ "$MODE" == "apply" ]]; then
  if [[ $rel_status -eq 0 || $nosql_status -eq 0 ]]; then
    overall_status=1
  fi
fi

if [[ $overall_status -ne 0 ]]; then
  echo "[seed-data][$ENVIRONMENT] Falhas detectadas na aplicação do seed. Consulte ${json_file}." >&2
  exit 1
fi

echo "[seed-data][$ENVIRONMENT] Rotina concluída (modo: ${MODE}). Evidências em ${EXPORT_DIR}."
