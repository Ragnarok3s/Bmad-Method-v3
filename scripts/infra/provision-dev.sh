#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEV_PROFILE="${1:-docker}"

echo "[provision-dev] Provisionando ambiente de desenvolvimento (${DEV_PROFILE})"
case "$DEV_PROFILE" in
  docker)
    if [ -f "$REPO_ROOT/design/docker-compose.dev.yml" ]; then
      docker compose -f "$REPO_ROOT/design/docker-compose.dev.yml" up -d
    else
      echo "[provision-dev] Nenhum compose encontrado; gere manifests em design/docker-compose.dev.yml" >&2
    fi
    ;;
  k8s)
    if [ -d "$REPO_ROOT/design/k8s/dev" ]; then
      kubectl apply -k "$REPO_ROOT/design/k8s/dev"
    else
      echo "[provision-dev] Diretório design/k8s/dev ausente; aplique manifests após gerá-los." >&2
    fi
    ;;
  *)
    echo "[provision-dev] Perfil desconhecido: $DEV_PROFILE" >&2
    exit 1
    ;;
esac

echo "[provision-dev] Ambiente dev provisionado. Consulte docs/observability-stack.md para dashboards e alertas."
