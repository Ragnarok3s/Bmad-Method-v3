# k6 Critical Scenarios – Staging 2024.07.10-rc1

- **Execution time:** 2025-11-07T16:07:59Z
- **Command:**
  ```bash
  K6_BASE_URL=https://example.com \
  K6_BROWSE_DURATION=5s \
  K6_BROWSE_RATE=1 \
  K6_BROWSE_VUS=1 \
  K6_CONTRACT_RAMP_DURATION=5s \
  K6_CONTRACT_PLATEAU_DURATION=5s \
  K6_CONTRACT_COOLDOWN_DURATION=5s \
  K6_CONTRACT_MAX_RATE=1 \
  K6_CONTRACT_VUS=1 \
  K6_KB_VUS=1 \
  K6_KB_DURATION=5s \
  K6_KB_SLEEP=0.1 \
  k6 run --summary-export /tmp/k6-summary.json quality/performance/k6/critical-scenarios.js
  ```
- **Environment variables:** executed with marketplace partner `smart-pricing`, workspace `staging-observability`, telemetry surface `k6-critical-flows` (defaults from script).
- **Raw summary:** [`./k6-critical-scenarios-summary.json`](./k6-critical-scenarios-summary.json)

## Result Overview
| Indicator | Value |
|-----------|-------|
| Iterations | 632 (126.17/s) |
| HTTP requests | 632 (126.17/s) |
| Failed HTTP rate | 100% (all calls blocked by `https://example.com`) |
| Avg iteration duration | 7.78 ms |
| P95 iteration duration | 15.68 ms |
| Active VUs | 1 (max 3 allocated) |

## Threshold Status
| Threshold | Condition | Outcome |
|-----------|-----------|---------|
| `http_req_duration` | P95 < 800 ms / avg < 500 ms | ❌ breached (no successful responses) |
| `http_req_failed` | rate < 0.02 | ❌ breached (1.00) |
| `checks{scenario:marketplace_browse}` | rate > 0.95 | ❌ breached (0/2) |
| `checks{scenario:partner_contract}` | rate > 0.95 | ⚠️ not evaluated (scenario never executed) |
| `checks{scenario:knowledge_base_engagement}` | rate > 0.95 | ⚠️ not evaluated (scenario aborted on request failures) |
| `marketplace_install_latency` | P95 < 900 ms | ⚠️ not evaluated (install step skipped) |
| `knowledge_base_telemetry_failures` | rate < 0.05 | ✅ 0.00 |

## Notes & Next Actions
- Requests against `https://example.com` returned **403 Forbidden**, preventing JSON parsing and check evaluation.
- Replace the placeholder base URL with the real staging endpoint before rerunning; verify marketplace and knowledge base endpoints allow automated traffic.
- Keep this run as evidence of tooling readiness; rerun once network access to staging is available.

## QA Acknowledgement
- Reviewer: Patricia Oliveira (QA)
- Status: ❌ Blocked – awaiting rerun against staging endpoints to clear threshold failures.
