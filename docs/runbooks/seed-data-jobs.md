# Runbook – Jobs de Seed de Dados (Dev/Staging)

## Objetivo
Garantir que os ambientes dev e staging sejam provisionados com datasets sintéticos mascarados, mantendo conformidade com `quality/privacy.py` e as métricas de observabilidade definidas em `docs/observability-stack.md`.

## Pré-Requisitos
- Acesso ao repositório de aplicação (`Bmad-Method-v3`).
- Variáveis de conexão configuradas:
  - `DEV_RELATIONAL_URL` / `DEV_NOSQL_URL`
  - `STAGING_RELATIONAL_URL` / `STAGING_NOSQL_URL`
- Ferramentas de cliente instaladas (`psql` e `mongoimport` ou `mongosh`).

## Procedimento Dev
1. Validar datasets antes da execução:
   ```bash
   ./scripts/infra/seed-dev-data.sh --mode validate
   ```
2. Aplicar o seed quando os serviços estiverem disponíveis (Docker Compose ou cluster dev):
   ```bash
   ./scripts/infra/seed-dev-data.sh --mode apply
   ```
3. Verificar métricas geradas em `artifacts/seed/dev_seed.prom` e `dev_seed.json`.
4. Atualizar o dashboard `bmad-agents-001` com o label `seed_job_success{environment="dev"}`.

## Procedimento Staging
1. Garantir acesso ao cluster/instância alvo e exportar as variáveis `STAGING_RELATIONAL_URL` e `STAGING_NOSQL_URL`.
2. Executar:
   ```bash
   ./scripts/infra/seed-staging-data.sh --mode apply
   ```
3. Confirmar a geração dos artefatos `artifacts/seed/staging_seed.*` e anexá-los ao ticket de auditoria quando solicitado.
4. Workflows automatizados:
   - `CD Staging` chama `./scripts/infra/seed-staging-data.sh --mode validate` antes da aprovação manual.
   - `Reset Staging` (agendado 05:00 UTC) executa `scripts/infra/reset-staging.sh` com `SEED_MODE=validate`.
5. Monitorar o alerta `SeedJobFailure` (ver `grafana/alerts/seed-jobs.yaml`) e acompanhar notificações no canal `#platform-ops`/PagerDuty.

## Pós-Execução
- Verificar se os datasets publicados em `docs/evidencias/compliance/seed-datasets/` continuam alinhados com o ambiente.
- Se algum passo falhar, executar novamente em modo `validate` para isolar o dataset afetado e abrir incidente conforme `docs/runbooks/alertas-criticos.md`.

## Métricas & Observabilidade
- Métricas Prometheus exportadas: `seed_job_success` e `seed_job_last_run_timestamp`.
- Alertas configurados no Grafana: `SeedJobFailure` (falha ou ausência de execução > 6h).
- Logs devem ser consultados via Loki com `service=seed-data` e label `playbook=seed`. Ajuste o scraping se necessário.
