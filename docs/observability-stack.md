# Seleção de Ferramentas de Observabilidade

Este documento recomenda ferramentas e práticas de logs, métricas e alertas para o MVP Bmad Method v3, priorizando integração rápida e escalabilidade.

## Requisitos

- Integração nativa com stack cloud existente (Kubernetes + GitOps).
- Suporte a OpenTelemetry para instrumentação padronizada.
- Painéis prontos para squads e stakeholders de negócio.
- Alertas configuráveis com escalonamento multi-time.

## Logs

| Camada | Ferramenta | Motivo | Implementação |
|--------|------------|--------|---------------|
| Aplicação | OpenTelemetry SDK + Logstash | Compatibilidade com linguagem e formatação estruturada JSON | Embutir exporters OTLP nos serviços, enviar para Logstash via Beats |
| Pipeline | Elasticsearch | Busca e retenção de 30 dias com indexação flexível | Cluster gerenciado (Elastic Cloud) com ILM para cold storage |
| Visualização | Kibana | Dashboards customizados e filtros por agente/playbook | Dashboards MVP pré-configurados com índices por ambiente |

## Métricas

| Camada | Ferramenta | Motivo | Implementação |
|--------|------------|--------|---------------|
| Coleta | OpenTelemetry Collector | Gateway central para métricas, logs e traces | Implantar via Helm chart no cluster k8s |
| Armazenamento | Prometheus + Thanos | Alta disponibilidade e retenção > 30 dias | Prometheus federado + Thanos para long-term storage |
| Visualização | Grafana | Painéis multi-fonte e alertas avançados | Provisionar dashboards: saúde de agentes, execução de playbooks, UX | 

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
| Saúde de Agentes (Grafana) | Monitorar latência, throughput e erros por agente/playbook. | Platform Engineer Lead | SRE On-call | Quinzenal (revisão técnica) + mensal com stakeholders de produto |
| Engajamento de Operações | Acompanhar KPIs operacionais (tempo de resposta, taxa de automatização). | Operations Manager | Product Analyst | Mensal |
| FinOps de Observabilidade | Analisar custos de ingestão/armazenamento por ambiente. | FinOps Analyst | Platform Engineer | Mensal com reporte para steering committee |

### Ownership de Runbooks

| Runbook | Escopo | Owner | Backup | Última Revisão | Próxima Revisão |
|---------|--------|-------|--------|----------------|-----------------|
| Alerta 5xx Serviços Core | Diagnóstico e mitigação de erros 5xx persistentes. | SRE On-call | Backend Tech Lead | Maio/2024 | Julho/2024 |
| Falhas em Jobs de Playbook | Tratativa para jobs agendados com falha recorrente. | Platform Engineer Lead | QA Lead | Maio/2024 | Junho/2024 |
| Queda de Engajamento Usuário | Procedimentos para investigar redução de engajamento. | Operations Manager | Product Owner | Abril/2024 | Junho/2024 |

### Processos de Revisão

1. Definir SLIs/SLOs para componentes críticos (latência de playbook, sucesso de onboarding, ingestão de logs).
2. Revisar dashboards de saúde quinzenalmente com stakeholders técnicos e mensalmente com equipa de produto.
3. Auditar runbooks mensalmente, atualizando critérios de acionamento, procedimentos de mitigação e owners quando necessário.
4. Estabelecer processo de _post-incident review_ com métricas de MTTA/MTTR, incluindo verificação de cobertura de runbooks e atualização de ações corretivas em até 5 dias úteis.
5. Consolidar resultados de revisões em relatório compartilhado no repositório GitOps e reportar riscos no steering committee.

## Roadmap Futuro

- Adotar detecção de anomalias com Machine Learning (Elastic ML) no pós-MVP.
- Integrar métricas de custo (FinOps) na mesma stack Grafana/Prometheus.
- Implementar SLO automatizado com Nobl9 ou Grafana SLOs.
