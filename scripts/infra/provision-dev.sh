#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEV_PROFILE="${1:-docker}"

compose_file="$REPO_ROOT/design/docker-compose.dev.yml"
k8s_dir="$REPO_ROOT/design/k8s/dev"

ensure_compose() {
  if [ ! -f "$compose_file" ]; then
    echo "[provision-dev] Nenhum compose encontrado; gere manifests em design/docker-compose.dev.yml" >&2
    return 1
  fi
  return 0
}

ensure_kustomize_dir() {
  if [ ! -d "$k8s_dir" ]; then
    echo "[provision-dev] Diretório design/k8s/dev ausente; aplique manifests após gerá-los." >&2
    return 1
  fi
  return 0
}

run_compose() {
  local mode="$1"
  ensure_compose || return 1
  if ! command -v docker >/dev/null 2>&1; then
    echo "[provision-dev] docker não encontrado no PATH." >&2
    return 1
  fi
  if [ "$mode" = "validate" ]; then
    echo "[provision-dev] Validando docker compose (${compose_file})."
    docker compose -f "$compose_file" config > /dev/null
  else
    echo "[provision-dev] Subindo serviços com docker compose."
    docker compose -f "$compose_file" up -d
  fi
}

kustomize_build() {
  local dir="$1"
  if command -v kubectl >/dev/null 2>&1; then
    kubectl kustomize "$dir"
  elif command -v kustomize >/dev/null 2>&1; then
    kustomize build "$dir"
  else
    echo "[provision-dev] kubectl/kustomize não encontrados para renderizar manifests." >&2
    return 1
  fi
}

run_kustomize() {
  local mode="$1"
  ensure_kustomize_dir || return 1
  if [ "$mode" = "validate" ]; then
    echo "[provision-dev] Validando manifests kustomize (${k8s_dir})."
    kustomize_build "$k8s_dir" > /dev/null
  else
    if ! command -v kubectl >/dev/null 2>&1; then
      echo "[provision-dev] kubectl não encontrado para aplicar manifests." >&2
      return 1
    fi
    echo "[provision-dev] Aplicando manifests Kubernetes em ${k8s_dir}."
    kubectl apply -k "$k8s_dir"
  fi
}

ACTION="apply"
profiles=("$DEV_PROFILE")
if [ "$DEV_PROFILE" = "docker/k8s" ]; then
  ACTION="validate"
  profiles=("docker" "k8s")
fi

echo "[provision-dev] Provisionando ambiente de desenvolvimento (${DEV_PROFILE})"
for profile in "${profiles[@]}"; do
  case "$profile" in
    docker)
      run_compose "$ACTION"
      ;;
    k8s)
      run_kustomize "$ACTION"
      ;;
    *)
      echo "[provision-dev] Perfil desconhecido: $profile" >&2
      exit 1
      ;;
  esac
done

if [ "$ACTION" = "validate" ]; then
  echo "[provision-dev] Validação concluída para docker compose e Kustomize."
else
  echo "[provision-dev] Ambiente dev provisionado. Consulte docs/observability-stack.md para dashboards e alertas."
fi
