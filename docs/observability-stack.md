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

1. Definir SLIs/SLOs para componentes críticos (latência de playbook, sucesso de onboarding, ingestão de logs).
2. Revisar painéis quinzenalmente com stakeholders.
3. Documentar runbooks por tipo de alerta, incluindo critérios de fechamento.
4. Estabelecer processo de _post-incident review_ com métricas de MTTA/MTTR.

## Roadmap Futuro

- Adotar detecção de anomalias com Machine Learning (Elastic ML) no pós-MVP.
- Integrar métricas de custo (FinOps) na mesma stack Grafana/Prometheus.
- Implementar SLO automatizado com Nobl9 ou Grafana SLOs.
