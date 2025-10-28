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

## Logs

| Camada | Ferramenta | Motivo | Implementação |
|--------|------------|--------|---------------|
| Aplicação | OpenTelemetry SDK + Logstash | Compatibilidade com linguagem e formatação estruturada JSON | Embutir exporters OTLP nos serviços, enviar para Logstash via Beats |
| Pipeline | Elasticsearch | Busca e retenção de 30 dias com indexação flexível | Cluster gerenciado (Elastic Cloud) com ILM para cold storage |
| Visualização | Kibana | Dashboards customizados e filtros por agente/playbook | Dashboards MVP pré-configurados com índices por ambiente (`kibana/dashboards/bmad-logs.ndjson`) |

## Métricas

| Camada | Ferramenta | Motivo | Implementação |
|--------|------------|--------|---------------|
| Coleta | OpenTelemetry Collector | Gateway central para métricas, logs e traces | Implantar via Helm chart no cluster k8s |
| Armazenamento | Prometheus + Thanos | Alta disponibilidade e retenção > 30 dias | Prometheus federado + Thanos para long-term storage |
| Visualização | Grafana | Painéis multi-fonte e alertas avançados | Provisionar dashboards: saúde de agentes, execução de playbooks, UX. Dashboards seed disponíveis no repositório GitOps (`grafana/staging/`). |

## Alertas

| Tipo | Ferramenta | Critérios | Ação |
|------|------------|----------|------|
| Técnicos | Grafana Alerting + PagerDuty | Erros 5xx > 2% por 5 min; jobs com falha > 3x | PagerDuty rota para SRE; fallback Slack #incident |
| Produto | Grafana + Slack | Queda > 20% no engajamento diário | Notificação no canal #product-ops e abertura de tarefa no Jira |
| Segurança | Elastic Watcher | Tentativas de acesso suspeitas | Integração com SIEM corporativo |

## Traços Distribuídos

- Instrumentar backend com OpenTelemetry (HTTP, gRPC, DB). Exportar para Tempo (Grafana) para análise de latência.
- Correlacionar traceID com logs e eventos de playbooks.

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
