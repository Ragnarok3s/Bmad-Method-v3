# Security Scanner Findings and Remediation Plan (14 Feb 2025)

## 1. Scanner Results Summary

### npm audit (workspace: @bmad/web)
- **next@14.2.5** — multiple critical vulnerabilities (cache poisoning, SSRF, DoS) fixed in `14.2.33` (`npm audit fix --force` recommendation).
- **@playwright/test@1.44.1** → transitively pulls **playwright@1.44.1**, which lacks TLS certificate validation during browser downloads. Fix available in `@playwright/test@1.56.1`.

### pip-audit (`requirements.txt`)
- **strawberry-graphql@0.221.0** — PYSEC-2024-171 and GHSA-5xh2-23cc-5jc6. Patches available in `0.243.0` and `0.257.0` respectively.
- **requests@2.32.3** — GHSA-9hjg-9r4m-mvj7 (potential credential disclosure). Update to `2.32.4`.
- **starlette@0.37.2** (FastAPI transitive dependency) — GHSA-f96h-pmfr-66vw, GHSA-2c2j-9gv5-cj73, GHSA-7f5h-v6xp-fcq8. Latest patch stream requires ≥`0.49.1`, implying a FastAPI upgrade to a release that pins Starlette ≥`0.49.1`.

## 2. Critical Update Prioritization & Regression Test Planning

| Priority | Component | Required Upgrade | Key Regression Tests |
| --- | --- | --- | --- |
| **Critical** | `next` (apps/web) | Bump to `14.2.33` to remediate eight critical advisories. | `npm run lint`, `npm run test:web:unit`, `npm run build`, `npm run test:web:e2e` |
| **High** | `@playwright/test` (apps/web devDeps) | Upgrade to `1.56.1` (pulls patched `playwright`). | `npm run test:web:e2e`, ensure browser binaries reinstall via `npm run playwright:install` |
| **High** | `fastapi` service stack | Adopt FastAPI release with Starlette ≥`0.49.1` (expected ≥`fastapi 0.115.x`). Also raises Starlette vulnerabilities. | `pytest`, targeted integration suites in `tests/integration` & `tests/e2e`, manual smoke on REST/GraphQL endpoints |
| **High** | `strawberry-graphql` | Upgrade to `0.257.0` (covers both advisories). | `pytest tests/integration/graphql` (if available), schema introspection checks |
| **Medium** | `requests` | Raise to `2.32.4`. | `pytest tests/integration` focusing on outbound HTTP clients |

Regression execution order: apply web updates first to unblock deployment, then backend library bumps in a feature branch with staggered QA (unit → integration → E2E). Document any failing tests before promotion.

## 3. Cross-Version Compatibility Review

### Web Application (`apps/web`)
- The project currently pairs **next@14.2.5** with **react@18.3.1** and **react-dom@18.3.1**. Patch-level upgrades within the 14.2 line should preserve compatibility with React 18.3, but confirm breaking changes in Next.js release notes when moving to `14.2.33`.
- Updating `@playwright/test` to 1.56.1 maintains compatibility with Node 18+ and preserves CLI parity. Ensure CI images contain the newer Chromium runtime fetched during postinstall.

### Core Services (`services/core`)
- `fastapi@0.111.0` currently depends on `starlette==0.37.2`; moving to a FastAPI release that pins Starlette ≥`0.49.1` will likely also require `pydantic>=2.7` (already satisfied) and reviewing middleware APIs (CORS, lifespan) defined in `services/core/api/rest.py`.
- `strawberry-graphql` upgrade introduces schema performance improvements; verify that `GraphQLRouter` initialization in `services/core/api/graphql.py` remains stable and re-run schema generation scripts if any custom extensions rely on deprecated APIs.
- `requests` is used for outbound HTTP integrations; the minor bump to `2.32.4` should be backwards compatible but requires retesting any mocked HTTP clients to ensure no strict header changes.

## 4. Corrective Actions & Timeline

1. **Week 1 (Immediate):**
   - Implement Next.js and Playwright upgrades, rerun lint/unit/e2e suites, and capture before/after bundle metrics.
   - Update pipeline cache keys if dependency hashes change.
2. **Week 2:**
   - Create backend upgrade branch: bump FastAPI (and transitives), Strawberry GraphQL, and Requests.
   - Run `pytest` (unit + integration) and targeted GraphQL schema validation; coordinate QA sign-off with platform team.
3. **Week 3:**
   - Conduct staging smoke tests across Web + Core services, focusing on authentication flows and GraphQL queries.
   - Prepare rollout plan with fallback strategy and monitor observability dashboards post-deploy.

Document remediation progress in the security runbook and open follow-up tickets for each dependency upgrade, referencing this report for traceability.

## Identity Service Hardening

- **Escopo**: o novo serviço `services/identity` usa o `TenantAccessRepository` e a tabela `tenant_agent_access` para impor isolamento de papéis por tenant. Toda alteração deve preservar a compatibilidade com o `AuthenticationService` e com os limites configurados em `TenantManager`.
- **Cobertura de testes**: executar `pytest tests/services/identity -q` como parte dos gates de segurança para validar MFA, login e revogação. Essa suíte está vinculada ao [roadmap do produto](../product-roadmap.md#atualização-2025-02-15-identidade-multi-tenant) e mapeada na [matriz STRIDE](stride-integracoes-housekeeping.md#camada-de-identidade-multi-tenant).
- **Monitoramento**: registrar métricas e logs emitidos pelo Identity Service no mesmo pipeline de observabilidade do core; auditar eventos críticos (`auth_mfa_failed`, `auth_login_blocked`) para confirmar que continuam presentes na trilha descrita em `services/core/observability.py`.
