# Inventário de Dashboards e Logs

## Objetivo
Consolidar os principais dashboards e fontes de logs disponíveis para a equipe, detalhando como acessá-los, interpretar os indicadores e quais alertas automatizados já estão configurados.

## Como acessar
- **Workspace Grafana:** `https://grafana.internal.bmad/` utilizando SSO corporativo.
- **Pasta principal:** `Observabilidade > BMad` contém a maior parte dos painéis listados abaixo.
- **Permissões:** solicitações de acesso via Jira (`PLAT-Access Grafana`).

## Visão geral dos dashboards
| Domínio | Caminho/UID | Principais métricas | Datasources | Alertas relacionados |
| --- | --- | --- | --- | --- |
| Analytics Pipeline | `grafana/analytics/pipeline-health.json` | Kafka consumer lag, throughput de ingestão Delta Lake, taxa de sucesso de validações Great Expectations | `observability-prometheus` | `SeedJobFailure` (Seed Jobs) monitorando sucesso e atraso de execuções; incidentes geram chamados no canal `#platform-ops` e PagerDuty SeedJobs. |
| Analytics Executivo | `grafana/analytics/executive-overview.json` | Receita por 30 dias, tendência diária de receita, conversão por canal/propriedade | `lakehouse-gold` | Sem alertas automáticos — monitoramento diário no ritual executivo. |
| Observabilidade QA | `grafana/staging/qa-quality-dashboard.json` | Erros críticos de pipeline QA, tempo de execução de suites, cobertura de testes | `prometheus-staging`, `loki` | Alertas roteados pela policy `qa-observability.yaml` para `#qa-reviews`. |
| Operações Plataforma (Staging) | `grafana/staging/bmad-ops-002.json` | Taxa de erro 5xx, falhas de pipeline CI, tráfego e engajamento web | `prometheus-staging` | Alertas `PlaybookErrorRate`, `PipelineFailureBurst`, `EngagementDrop` conforme `staging.yaml`, com rota para `#incident` e PagerDuty `BmadPlatformStaging`. |
| Compliance Overview | `grafana/compliance/compliance-overview.json` | Checkpoints aprovados/rejeitados, eventos críticos, enforcement de MFA | `prometheus`, `loki` | Sem alerta dedicado; usar regra `policy-drift` quando publicada. |
| Compliance Policy Drift | `grafana/compliance/policy-drift.json` | Desvios de políticas IAM e auditoria | `prometheus`, `loki` | Planejado: adicionar regra de alerta em `compliance` folder (pendente). |
| Observabilidade Agentes | `grafana/staging/bmad-agents-001.json` | Saúde dos agentes BMad (fila de jobs, latência, consumo CPU) | `prometheus-staging` | Cobertos pelas mesmas rotas críticas de staging (`staging.yaml`). |

> **Dica:** Utilizar variáveis de ambiente disponíveis nos painéis (ex.: `environment`) para filtrar métricas por ambiente antes de abrir um incidente.

## Logs (Loki)
- **Consultas pré-configuradas:**
  - Compliance: `{app="bmad-core", stream="compliance"}` (painel "Últimos checkpoints").
  - Pipelines QA: `{app="qa-runner", level="error"}` (favoritos em `QA Quality Dashboard`).
  - Web bundler: `{app="bmad-web", deployment_environment="staging"}` (útil para cruzar com alertas de engajamento).
- **Boas práticas:**
  - Salvar queries personalizadas como `Starred` para facilitar o reuso em incidentes.
  - Exportar logs críticos para `docs/evidencias/observabilidade/` quando necessário para auditoria.

## Mapa de alertas existentes
| Arquivo | Escopo | Canal de notificação | PagerDuty | Playbook de referência |
| --- | --- | --- | --- | --- |
| `grafana/alerts/staging.yaml` | Erros 5xx, falhas de pipeline, queda de engajamento em staging | `#incident` | `BmadPlatformStaging` | `docs/runbooks/alertas-criticos.md`, `docs/runbooks/observabilidade-servicos.md` |
| `grafana/alerts/seed-jobs.yaml` | Execução de seed jobs em staging | `#platform-ops` | `SeedJobs` | `docs/runbooks/seed-data-jobs.md` |
| `grafana/alerts/qa-observability.yaml` | Gates de qualidade QA | `#qa-reviews` | — | `docs/runbooks/qa-observability-review.md` |

## Próximos passos
- Configurar alerta de **Policy Drift** reutilizando `grafana/compliance/policy-drift.json` como fonte de métricas.
- Revisar se dashboards executivos precisam de resumo semanal automatizado.
- Documentar queries padrão em `docs/templates/consultas-loki.md` (backlog).
