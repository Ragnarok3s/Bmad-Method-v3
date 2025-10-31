#!/usr/bin/env bash
set -euo pipefail

NAMESPACE="${1:-bmad-method-staging}"
shift || true

if [[ $# -eq 0 ]]; then
  DEPLOYMENTS=(backend identity frontend)
else
  DEPLOYMENTS=("$@")
fi

if ! command -v kubectl >/dev/null 2>&1; then
  echo "[validate-rollout] kubectl não encontrado; validação ignorada." >&2
  exit 0
fi

if ! kubectl config current-context >/dev/null 2>&1; then
  echo "[validate-rollout] Contexto do kubectl indisponível; validação ignorada." >&2
  exit 0
fi

for deployment in "${DEPLOYMENTS[@]}"; do
  echo "[validate-rollout] Aguardando rollout para ${deployment} no namespace ${NAMESPACE}"
  if ! kubectl --namespace "$NAMESPACE" rollout status "deployment/${deployment}" --timeout=180s; then
    echo "[validate-rollout] Rollout falhou para ${deployment}" >&2
    exit 1
  fi
  echo "[validate-rollout] Deployment ${deployment} saudável."
fi

echo "[validate-rollout] Todos os rollouts foram concluídos com sucesso."
