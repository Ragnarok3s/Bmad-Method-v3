#!/usr/bin/env bash
set -euo pipefail

WORKFLOWS=(
  backend.yml
  frontend.yml
  contracts.yml
  payments.yml
  ci.yml
)

env_name=${1:-staging-prod}
now=$(date --utc +%Y-%m-%dT%H:%M:%SZ)

cat <<LOG
# Workflow Dispatch Dry Run
- timestamp: ${now}
- environment: ${env_name}
- note: Offline container cannot reach GitHub Actions API; capturing intended dispatch commands for traceability.
LOG

for wf in "${WORKFLOWS[@]}"; do
  cat <<LOG

## ${wf}
- command: gh workflow run ${wf} --ref main --field environment=${env_name}
- status: skipped (no GitHub token available in sandbox)
LOG
done
