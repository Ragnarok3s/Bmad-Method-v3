# Runbook – Alertas Críticos (PlaybookErrorRate, PipelineFailureBurst, EngagementDrop)

## Objetivo
Descrever o fluxo de resposta para os alertas críticos configurados na Sprint 0 e garantir restauração rápida do serviço.

## Disparadores
- **PlaybookErrorRate**: taxa de erro 5xx > 2% por 5 minutos consecutivos.
- **PipelineFailureBurst**: falha em mais de 3 execuções consecutivas do pipeline CI/CD.
- **EngagementDrop**: queda > 20% na métrica de engajamento diário dos usuários.

## Responsáveis
- **Primário**: Inês Duarte (SRE On-call) – PagerDuty `bmad-platform-staging`.
- **Backup**: Bruno Carvalho (Platform Engineer Lead).
- **Escalonamento**: Luís Ferreira (Operations Manager) para impactos de negócio; Security on-call em caso de suspeita de fraude.

## Procedimento
1. **Reconhecimento do Alerta**
   - Acknowledge via PagerDuty em até 5 minutos.
   - Registrar incidente em `#incident` com template `/incident start`.
2. **Coleta de Evidências**
   - Consultar dashboards Grafana `bmad-agents-001` e `bmad-ops-002`.
   - Correlacionar com logs no Kibana (`kibana/dashboards/bmad-logs.ndjson`).
   - Validar traces recentes no Tempo (`tempo/explore?var-service=bmad-core-service`).
   - Usar o runbook `docs/runbooks/observabilidade-servicos.md` para checklist completo.
3. **Mitigação Imediata**
   - Erros 5xx: aplicar rollback conforme `docs/runbooks/rollback-staging.md`.
   - PipelineFailureBurst: congelar merges (colocar etiqueta `ci-blocked`) e validar fila de jobs no GitHub Actions.
   - EngagementDrop: acionar time de produto para comunicação via `#product-ops` e verificar experimentos ativos.
4. **Recuperação**
   - Validar métricas de sucesso (latência P95 < 500 ms, taxa de erro < 1%).
   - Atualizar estado do incidente para `Mitigated` após estabilização por 15 minutos.
5. **Encerramento e Follow-up**
   - Documentar causa raiz em `docs/atas/ata-incident-<data>.md`.
   - Garantir atualização de runbooks impactados.
   - Agendar retrospectiva em até 48h úteis se MTTR > 1h.

## Indicadores de Saúde
- MTTA (tempo até reconhecimento) < 5 minutos.
- MTTR (tempo de recuperação) < 45 minutos.
- 0 alertas perdidos sem actionables.

## Métricas & Consultas de Referência

- **Latência P95**: `histogram_quantile(0.95, sum(rate(http_server_duration_bucket{service_name="bmad-core-service"}[5m])) by (le))`
- **Erro 5xx**: `sum(rate(http_server_duration_count{http_response_status_code=~"5.."}[5m]))`
- **Reservas Confirmadas**: `sum(increase(bmad_core_reservations_confirmed_total[15m]))`
- **Engajamento Web**: `sum(increase(bmad_web_page_view_total[15m])) by (route)`

## Links Úteis
- Grafana Staging: `https://grafana.staging.bmad-method.internal`
- Kibana Staging: `https://kibana.staging.bmad-method.internal`
- PagerDuty Service: `https://pagerduty.com/services/bmad-platform-staging`
