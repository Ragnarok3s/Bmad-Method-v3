# Seleção de Ferramentas de Observabilidade

Este documento recomenda ferramentas e práticas de logs, métricas e alertas para o MVP Bmad Method v3, priorizando integração rápida e escalabilidade.

## Requisitos

- Integração nativa com stack cloud existente (Kubernetes + GitOps).
- Suporte a OpenTelemetry para instrumentação padronizada.
- Painéis prontos para squads e stakeholders de negócio.
- Alertas configuráveis com escalonamento multi-time.

## Entregáveis Sprint 0

| Item | Descrição | Localização |
|------|-----------|-------------|
| Dashboard `Saúde de Agentes` | Painel Grafana (ID `bmad-agents-001`) com latência P95, throughput e taxa de erro por ambiente. | `grafana/staging/bmad-agents-001.json` (repositório de manifests) |
| Dashboard `Operações & Engajamento` | KPIs de onboarding concluído, automações executadas e backlog aberto. | `grafana/staging/bmad-ops-002.json` |
| Coleta de Logs | Loki + Promtail configurados com labels `env`, `service` e `playbook`. Retenção de 14 dias. | Namespace `observability` em dev/staging |
| Alertas Críticos | Três regras Grafana Alerting: `PlaybookErrorRate`, `PipelineFailureBurst`, `EngagementDrop`. | `grafana/alerts/staging.yaml` |
| Runbooks Publicados | Procedimentos documentados para alarmes críticos e incidentes. | `docs/runbooks/` |
| Integração PagerDuty | Serviço `bmad-platform-staging` com rota primária SRE e fallback Ops. | Configuração registrada em `docs/runbooks/alertas-criticos.md` |

### Implementação no Repositório

- Dashboard `QA-Quality` versionado em `grafana/staging/qa-quality-dashboard.json`, alinhado às métricas definidas em `docs/testing-strategy.md`.
- Regras de alerta para cerimônias de QA configuradas em `grafana/alerts/qa-observability.yaml`, notificando o canal `#qa-reviews`.
- Runbook específico para revisão de QA/observabilidade disponível em `docs/runbooks/qa-observability-review.md`.
- Métricas de seed (`seed_job_success` e `seed_job_last_run_timestamp`) exportadas por `scripts/infra/seed-*-data.sh` e alertas dedicados em `grafana/alerts/seed-jobs.yaml`.
- Instrumentação backend publicada em `services/core/observability.py` e métricas de domínio em `services/core/metrics.py`.
- Telemetria do frontend inicializada via `apps/web/components/telemetry/TelemetryProvider.tsx` e `apps/web/telemetry/init.ts`.
- Dashboards novos (`grafana/staging/bmad-agents-001.json`, `grafana/staging/bmad-ops-002.json`) e alertas `grafana/alerts/staging.yaml` alinhados aos serviços core/web.

## Logs

| Camada | Ferramenta | Motivo | Implementação |
|--------|------------|--------|---------------|
| Aplicação | OpenTelemetry SDK (FastAPI/Next.js) | Instrumentação nativa e correlação com métricas/traces | Exporters OTLP configurados em `services/core/observability.py` e `apps/web/telemetry/init.ts` |
| Coletor | OpenTelemetry Collector | Normaliza OTLP (gRPC/HTTP), aplica enriquecimento e roteia para destinos múltiplos | Deploy Helm/Kustomize com pipelines `logs -> loki` e `logs -> S3` (opcional) |
| Armazenamento | Grafana Loki | Consulta rápida por labels (`service.name`, `deployment.environment`) e retenção econômica | StatefulSet gerenciado pelo time de plataforma; configuração referenciada em `grafana/` |
| Visualização | Grafana Explore | Interface unificada com correlação por traceID e dashboards versionados | Dashboards/queries salvos em `grafana/staging/*.json` |

## Métricas

| Camada | Ferramenta | Motivo | Implementação |
|--------|------------|--------|---------------|
| Instrumentação | OpenTelemetry SDK (metrics API) | Conjuntos de métricas compartilhados entre backend e frontend | Counters/recorders definidos em `services/core/metrics.py` e `apps/web/telemetry/init.ts` |
| Gateway | OpenTelemetry Collector | Converte OTLP -> Prometheus Remote Write e agrega atributos padrão | Pipeline `metrics -> prometheusremotewrite` com labels `service.namespace`, `deployment.environment` |
| Armazenamento | Prometheus + Thanos | Retenção >30 dias e query distribuída | Instâncias dedicadas por ambiente com sidecar Thanos para histórico | 
| Visualização | Grafana | Dashboards multi-fonte e alertas versionados | Dashboards em `grafana/staging/` validados por `verify_observability_gates.py` |

## Alertas

| Tipo | Ferramenta | Critérios | Ação |
|------|------------|----------|------|
| Técnicos | Grafana Alerting + PagerDuty | Erros 5xx > 2% por 5 min; ausência de sinais OTEL > 10 min | PagerDuty rota SRE + fallback Slack `#incident` |
| Produto | Grafana Alerting + Slack | Queda > 20% no engajamento diário ou backlog OTA > 5 | Slack `#product-ops` + criação de issue Jira |
| Segurança | Grafana Alerting + SIEM | Eventos `audit_logs` com status suspeito (>5 por 10 min) | Integração com SIEM corporativo via webhook Collector |
| Operacional | Grafana Alerting + Prometheus | `seed_job_success==0` por 5 min ou `seed_job_last_run_timestamp` > 6h | PagerDuty `bmad-platform-staging` + canal `#platform-ops` |

## Traços Distribuídos

- Instrumentar backend com OpenTelemetry (HTTP, SQLAlchemy, jobs internos) e enviar via OTLP/gRPC para o Collector com destino Tempo.
- Utilizar `trace_id` exposto pelo backend (respostas REST/GraphQL) para correlação com logs Loki e métricas de domínio.
- Frontend publica spans/métricas via OTLP HTTP usando `TelemetryProvider`, garantindo alinhamento de atributos (`service.name=bmad-web-app`).

## Governança de Observabilidade

### Ownership de Dashboards

| Dashboard | Objetivo | Owner | Backup | Cadência de Revisão |
|-----------|----------|-------|--------|---------------------|
| Saúde de Agentes (Grafana) | Monitorar latência, throughput e erros por agente/playbook. | Bruno Carvalho (Platform Engineer Lead) | Inês Duarte (SRE On-call) | Quinzenal (revisão técnica) + mensal com stakeholders de produto |
| Engajamento de Operações | Acompanhar KPIs operacionais (tempo de resposta, taxa de automatização). | Luís Ferreira (Operations Manager) | Paula Gomes (Product Analyst) | Mensal |
| FinOps de Observabilidade | Analisar custos de ingestão/armazenamento por ambiente. | Marina Lopes (FinOps Analyst) | Bruno Carvalho (Platform Engineer Lead) | Mensal com reporte para steering committee |

### Ownership de Runbooks

| Runbook | Escopo | Owner | Backup | Última Revisão | Próxima Revisão |
|---------|--------|-------|--------|----------------|-----------------|
| Alerta 5xx Serviços Core | Diagnóstico e mitigação de erros 5xx persistentes. | Inês Duarte (SRE On-call) | Pedro Martins (Backend Tech Lead) | Maio/2024 | Julho/2024 |
| Falhas em Jobs de Playbook | Tratativa para jobs agendados com falha recorrente. | Bruno Carvalho (Platform Engineer Lead) | Carla Nunes (QA Lead) | Maio/2024 | Junho/2024 |
| Queda de Engajamento Usuário | Procedimentos para investigar redução de engajamento. | Luís Ferreira (Operations Manager) | Ana Ribeiro (Product Owner) | Abril/2024 | Junho/2024 |

### Processos de Revisão

1. Definir SLIs/SLOs para componentes críticos (latência de playbook, sucesso de onboarding, ingestão de logs).
2. Revisar dashboards de saúde quinzenalmente com stakeholders técnicos e mensalmente com equipa de produto.
3. Auditar runbooks mensalmente, atualizando critérios de acionamento, procedimentos de mitigação e owners quando necessário.
4. Estabelecer processo de _post-incident review_ com métricas de MTTA/MTTR, incluindo verificação de cobertura de runbooks e atualização de ações corretivas em até 5 dias úteis.
5. Consolidar resultados de revisões em relatório compartilhado no repositório GitOps e reportar riscos no steering committee.
6. Atualizar o quadro de ações corretivas (`docs/revisao-validacao-artefatos.md`) ao final de cada revisão semanal da Semana 1 do kick-off.
7. Formalizar revisão de custos trimestral com FinOps (liderada por Marina Lopes) e publicar resumo em `#platform-ops`.

### Cadência de Revisão de Alertas e Custos

- **Alertas Críticos (SRE/Plataforma)**: revisão quinzenal conduzida por Bruno Carvalho com apoio de Inês Duarte; métricas exportadas automaticamente do Grafana (`dashboard Saúde de Agentes`).
- **Alertas de Produto**: inspeção mensal liderada por Luís Ferreira para confirmar cobertura de engajamento, com ata compartilhada no Notion do PMO.
- **FinOps de Observabilidade**: checkpoint mensal conduzido por Marina Lopes (FinOps Analyst) com Bruno Carvalho; revisão trimestral adiciona análise de tendências de custo e recomendações de otimização.
- **Auditoria de Runbooks**: confirmação bimestral de que runbooks possuem owners ativos e registros de execução pós-incidente arquivados no diretório `docs/runbooks/`.

## Roadmap Futuro

- Adotar detecção de anomalias com Machine Learning (Elastic ML) no pós-MVP.
- Integrar métricas de custo (FinOps) na mesma stack Grafana/Prometheus.
- Implementar SLO automatizado com Nobl9 ou Grafana SLOs.
