# Performance Evidence – k6 Critical Scenarios

This file captures the performance exercise executed for staging build `2024.07.10-rc1` prior to billing gateway release readiness.

- **Source report:** [`../../staging/2024.07.10-rc1/quality/performance-k6.md`](../../staging/2024.07.10-rc1/quality/performance-k6.md)
- **Summary export:** [`k6-critical-scenarios-summary.json`](./k6-critical-scenarios-summary.json)
- **Dispatch log reference:** [`workflow-dispatch-first-run.md`](./workflow-dispatch-first-run.md)

## Snapshot
| Field | Detail |
|-------|--------|
| Execution timestamp | 2025-11-07T16:07:59Z |
| Base URL used | https://example.com (placeholder – staging host unavailable offline) |
| Iterations | 632 |
| HTTP failures | 100% (403 Forbidden responses) |
| Threshold breaches | `http_req_duration`, `http_req_failed`, `checks{scenario:marketplace_browse}` |
| QA status | ❌ Blocked – requires rerun against real staging APIs |

## Follow-up
1. Update environment variables to target the real staging cluster for the billing gateway and rerun the script.
2. Attach rerun logs alongside this evidence once the staging endpoints are accessible.
