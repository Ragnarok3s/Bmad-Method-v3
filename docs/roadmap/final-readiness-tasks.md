# Tarefas de Readiness Final – Release 2024-07-15

Conjunto de ações restantes para concluir a preparação comercial antes do go-live com clientes reais. Cada tarefa traz passos operacionais, artefatos a atualizar e owners previstos a partir da ata da sessão de go/no-go (2024-07-15).

## 1. Encerrar BILL-230 e atualizar reconciliação
- Implementar a validação de `idempotency_key` no gateway de pagamentos e promover as atualizações necessárias no modelo de reconciliação do data warehouse para refletir os campos novos exigidos no relatório final de compliance.

:::task-stub{title="Encerrar BILL-230 e atualizar reconciliação"}
1. Revisar `services/billing/api/routes.py` e os drivers/clients do gateway em `services/payments/` (por exemplo `services/payments/drivers.py` e `services/payments/gateways/`) para garantir a propagação e validação do `idempotency_key` em chamadas externas (ticket `BILL-230`).
2. Atualizar contratos e testes de integração relacionados (`tests/e2e/payments/test_gateway_flows.py`, `tests/integration/test_payments_gateway.py`) cobrindo cenários com chave idempotente repetida.
3. Ajustar modelos do data warehouse em `analytics/dbt/models/` (criar pasta `payments/` se necessário) incorporando colunas de reconciliação exigidas no relatório e atualizar o arquivo `schema.yml` correspondente (por exemplo em `analytics/dbt/models/silver/schema.yml`).
4. Atualizar checkboxes pendentes em `docs/compliance/releases/2024-07-15-billing-gateway/final-report.md` com evidências anexadas no mesmo diretório.
:::

## 2. Validar retenção e thresholds pós-go/no-go
- Concluir as ações A2 e A4 da ata de readiness garantindo aprovação jurídica da retenção automatizada e calibração final de observabilidade/FinOps.

:::task-stub{title="Formalizar retenção automatizada e thresholds de observabilidade"}
1. Consolidar evidências de retenção em `docs/evidencias/compliance/privacy-readiness.yaml` e submeter a revisão jurídica, anexando parecer em `docs/compliance/releases/2024-07-15-billing-gateway/`.
2. Revisar dashboards e alertas em `grafana/dashboards/` e `grafana/alerts/` ajustando thresholds conforme baseline acordado; registrar alterações em `quality/observability/runbooks/critical-alerts.md`.
3. Executar `scripts/finops/rollback_and_tag.py validate --environment <alvo>` seguido de `scripts/finops/rollback_and_tag.py rollback --environment <alvo> --dry-run` (removendo `--dry-run` quando for hora de aplicar) garantindo logs e relatórios em `analytics/finops/reports/2025-11.md`.
4. Atualizar a matriz de riscos em `docs/roadmap-riscos.md` marcando os itens como mitigados e registrar o encerramento das ações A2/A4 em `docs/roadmap/readiness-meetings.md`.
:::

## 3. Fechar lacunas de QA e performance
- Reexecutar a bateria pendente de performance e garantir que todos os workflows GitHub Actions estejam automatizados para o ambiente `staging-prod` com relatórios arquivados.

:::task-stub{title="Reexecutar performance e consolidar sign-off de QA"}
1. Provisionar o binário k6 e rodar `quality/performance/k6/critical-scenarios.js` apontando para `STAGING_PROD_BASE_URL`; salvar métricas em `releases/staging/2024.07.10-rc1/quality/performance-k6.md`.
2. Disparar workflows `.github/workflows/backend.yml`, `frontend.yml`, `contracts.yml`, `payments.yml` e `ci.yml` com `environment=staging-prod`, garantindo execução automática sem acionamento manual.
3. Atualizar `releases/staging/2024.07.10-rc1/quality/test-report.md` e `docs/quality/test-summary.md` com resultados agregados e o sign-off final do time de QA.
4. Anexar logs de execução e aprovações correspondentes em `releases/2024-07-15-billing-gateway/qa/` (criar diretório se necessário) para rastreabilidade.
:::

## 4. Revisar observabilidade e automação FinOps
- Garantir que a automação de rollback/tagging e a retenção de métricas >30 dias estejam operacionais após os ajustes recentes.

:::task-stub{title="Validar automações de observabilidade e FinOps"}
1. Executar cenários de rollback simulados usando `scripts/finops/rollback_and_tag.py rollback --environment staging --dry-run` (e, se necessário, a variante sem `--dry-run` para aplicar) registrando resultados em `quality/observability/runbooks/finops-rollback.md`.
2. Verificar políticas de retenção em `grafana/analytics/` e `grafana/staging/` assegurando que métricas críticas possuam retenção configurada conforme as recomendações A4.
3. Atualizar `docs/roadmap-riscos.md` e `analytics/finops/reports/2025-11.md` com o status pós-validação, destacando custos estimados do novo ciclo de retenção.
4. Notificar conclusão em `releases/2024-07-15-billing-gateway/go-no-go.md` adicionando adendo de monitoramento e anexar quaisquer scripts ou dashboards ajustados a `quality/observability/runbooks/`.
:::

## 5. Entregar épico BL-02 na página `/agentes`
- Concluir a paridade funcional e de acessibilidade entre as rotas `/agentes` e `/agents`, incluindo telemetria e testes.

:::task-stub{title="Finalizar BL-02 para a variante `/agentes`"}
1. Implementar catálogo dinâmico na página `apps/web/app/agentes/page.tsx` reutilizando `useAgentsCatalog`, `AgentsFilters` e telemetria de pré-configuração; garantir internacionalização adequada em `apps/web/i18n/`.
2. Extrair o botão de ação compartilhado para `apps/web/components/actions/LaunchBundleButton.tsx` (ou pasta equivalente) e substituir usos em `/agents` e `/agentes`.
3. Adicionar testes RTL e axe em `apps/web/src/__tests__/agentes/` cobrindo estados carregado, vazio, erro e navegação por teclado; garantir execução via `npm run test --workspace @bmad/web`.
4. Atualizar `docs/product/backlog.md`, `docs/product-roadmap.md` e a issue `docs/issues/agents-page-feedback-a11y.md` com evidências (prints, logs de testes) e fechar o épico BL-02.
:::

## 6. Automatizar comunicação pós-incidente (SUP-211)
- Finalizar a automação de notificação a stakeholders e refletir o fluxo no manual de suporte antes do go-live comercial.

:::task-stub{title="Concluir automação de comunicação pós-incidente"}
1. Desenvolver o fluxo automatizado (bot/integração) em `scripts/support/` ou `platform/automation/` para disparar mensagens em Slack/Teams conforme runbooks de incidente.
2. Atualizar `docs/support/user-manual.md` documentando o passo a passo da automação e como ativá-la durante incidentes.
3. Criar playbook rápido em `quality/observability/runbooks/communication-post-incident.md` com templates de mensagem e owners.
4. Registrar aprovação final da equipe de suporte em `docs/support/approvals/` (novo arquivo `2024-07-20-sup-211-automation.md`) anexando captura da execução.
:::
