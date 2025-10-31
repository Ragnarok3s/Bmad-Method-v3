# Runbook de Incidentes de Observabilidade

## Objetivo
Estabelecer procedimento padronizado para responder a incidentes monitorados pelos painéis e alertas de observabilidade, garantindo cumprimento dos SLOs e comunicação clara com operações e suporte.

## Escopo
- Alertas definidos em `grafana/alerts/staging.yaml`, `grafana/alerts/seed-jobs.yaml` e `grafana/alerts/qa-observability.yaml`.
- Incidentes detectados pelos dashboards listados em `docs/observabilidade/dashboards-e-logs.md`.
- Ambientes: `staging` (principal), `qa` e integrações analytics.

## Métricas SLO
| Indicador | SLO | Fonte |
| --- | --- | --- |
| Erros 5xx no `bmad-core-service` | < 2% nos últimos 5 minutos | Painel "Operações Plataforma (Staging)" e alerta `PlaybookErrorRate` |
| Tempo médio de restauração (MTTR) para pipelines de deploy | < 30 minutos | Painel `bmad-ops-002` + logs Loki (`bmad-ci-runner`) |
| Taxa de sucesso de validações Great Expectations | ≥ 98% em janela de 15 minutos | Painel "Analytics Pipeline" |
| Freshness dos Seed Jobs | Última execução < 6 horas | Alerta `SeedJobFailure` |
| Latência p95 das APIs públicas | < 800ms em staging | Painel `bmad-agents-001` (gráfico de latência) |

## Detecção
1. Alertas chegam via Slack (`#incident`, `#platform-ops`, `#qa-reviews`) ou PagerDuty.
2. Para incidentes manuais, revisar dashboards em `Observabilidade > BMad` e logs associados no Loki.

## Triagem inicial
1. Confirmar se o alerta está ativo há mais de 2 minutos (evitar flaps).
2. Identificar qual SLO está em risco e capturar screenshot/log relevante.
3. Registrar incidente no canal `#incident` com template:
   ```
   [INCIDENTE][serviço] - descrição breve
   Hora detecção: HH:MM
   SLO afetado: ...
   Próximos passos: ...
   ```
4. Abrir ticket Jira (`OPS-INC`) se o incidente não for resolvido em 15 minutos.

## Contenção e mitigação
- **Erros 5xx:**
  1. Validar último deploy (`git log` / CI pipeline) e, se necessário, acionar rollback (`docs/runbooks/rollback-staging.md`).
  2. Verificar dependências (DB, cache) via dashboards específicos.
- **Falhas de Pipeline CI:**
  1. Verificar fila de runners e jobs travados.
  2. Priorizar reexecução dos pipelines críticos e congelar merges até estabilizar.
- **Queda de Engajamento:**
  1. Conferir logs de frontend (`bmad-web`) e status de integrações externas.
  2. Notificar Product Ops para investigar campanhas em paralelo.
- **Seed Jobs:**
  1. Executar manualmente `scripts/infra/seed-staging-data.sh` (garante seeds atualizados para staging).
  2. Validar data de atualização em `analytics.gold_seeds_monitoring`.
- **Incidentes QA:**
  1. Rodar novamente o suite falho e coletar logs `qa-runner`.
  2. Se 2 execuções consecutivas falharem, abrir bug em `QA` project.

## Escalação e contatos
| Função | Contato | Horário |
| --- | --- | --- |
| On-call SRE | PagerDuty `BmadPlatformStaging` | 24x7 |
| DevOps Pipeline | Slack `@devops-oncall` + PagerDuty SeedJobs | Horário comercial (escalável via PagerDuty fora do horário) |
| Product Ops | Slack `@product-ops` | 08h-18h BRT |
| QA Lead | Slack `@qa-lead` / Canal `#qa-reviews` | 09h-19h BRT |

## Comunicação
- Atualizações a cada 15 minutos no canal `#incident` enquanto o incidente estiver aberto.
- Caso impacto seja superior a 30 minutos, publicar nota em `StatusPage` (template em `docs/templates/statuspage.md`).
- Pós-incidente: registrar relatório em `docs/reports/postmortems/` com causa raiz e ações preventivas.

## Encerramento
1. Confirmar normalização do SLO afetado no dashboard correspondente.
2. Encerrar alerta no PagerDuty/Slack e atualizar ticket Jira.
3. Registrar aprendizados e follow-ups no post-mortem dentro de 48h.

## Referências
- `docs/observabilidade/dashboards-e-logs.md`
- `docs/runbooks/observabilidade-servicos.md`
- `docs/runbooks/alertas-criticos.md`
