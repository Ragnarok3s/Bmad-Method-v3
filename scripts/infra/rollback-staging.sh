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
  echo "[rollback-staging] kubectl não encontrado; rollback automático não executado." >&2
  exit 0
fi

if ! kubectl config current-context >/dev/null 2>&1; then
  echo "[rollback-staging] Contexto do kubectl indisponível; rollback automático ignorado." >&2
  exit 0
fi

for deployment in "${DEPLOYMENTS[@]}"; do
  echo "[rollback-staging] Revertendo deployment ${deployment} no namespace ${NAMESPACE}"
  kubectl --namespace "$NAMESPACE" rollout undo "deployment/${deployment}" || true
  kubectl --namespace "$NAMESPACE" rollout status "deployment/${deployment}" --timeout=120s || true
done

echo "[rollback-staging] Rotina de rollback concluída."
