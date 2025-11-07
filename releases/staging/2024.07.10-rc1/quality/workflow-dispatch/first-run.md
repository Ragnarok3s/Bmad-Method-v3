# Workflow Dispatch Dry Run
- timestamp: 2025-11-07T16:08:21Z
- environment: staging-prod
- note: Offline container cannot reach GitHub Actions API; capturing intended dispatch commands for traceability.

## backend.yml
- command: gh workflow run backend.yml --ref main --field environment=staging-prod
- status: skipped (no GitHub token available in sandbox)

## frontend.yml
- command: gh workflow run frontend.yml --ref main --field environment=staging-prod
- status: skipped (no GitHub token available in sandbox)

## contracts.yml
- command: gh workflow run contracts.yml --ref main --field environment=staging-prod
- status: skipped (no GitHub token available in sandbox)

## payments.yml
- command: gh workflow run payments.yml --ref main --field environment=staging-prod
- status: skipped (no GitHub token available in sandbox)

## ci.yml
- command: gh workflow run ci.yml --ref main --field environment=staging-prod
- status: skipped (no GitHub token available in sandbox)
