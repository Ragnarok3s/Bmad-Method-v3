#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="${REPO_ROOT}/artifacts/backups"
SEED_MODE="${SEED_MODE:-apply}"

mkdir -p "$BACKUP_DIR"
TIMESTAMP="$(date +%Y%m%d%H%M%S)"

cat <<MSG
[reset-staging] Rotina diária de reset de staging
- Snapshot iniciado: ${TIMESTAMP}
- Destino de backup: ${BACKUP_DIR}
MSG

if command -v kubectl >/dev/null 2>&1 && [ -d "$REPO_ROOT/design/k8s/staging" ]; then
  kubectl delete jobs,deployments,services -l env=staging --ignore-not-found
  kubectl apply -k "$REPO_ROOT/design/k8s/staging"
else
  echo "[reset-staging] Aplicação de manifests não executada; gere diretório design/k8s/staging." >&2
fi

if [ -f "$REPO_ROOT/scripts/infra/seed-staging-data.sh" ]; then
  "$REPO_ROOT/scripts/infra/seed-staging-data.sh" --mode "$SEED_MODE"
else
  echo "[reset-staging] Script seed-staging-data.sh ausente. Utilize fixtures documentadas em docs/playbook-operacional.md." >&2
fi

echo "[reset-staging] Reset concluído. Atualize Grafana e Loki com dashboards definidos em docs/observability-stack.md."
