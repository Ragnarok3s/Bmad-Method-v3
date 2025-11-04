# Plano Pós-Lançamento — Billing Gateway 2024-07-15

## Monitoramento 24h
- **Janela de cobertura:** 18/07 a 01/08, com reavaliação após estabilização das métricas de erro por 72h consecutivas.
- **Turnos:**
  - L1 (Suporte): 08h-20h BRT, operadores Joana Lima / Rafael Prado.
  - L2 (SRE de plantão): 20h-08h BRT, rotação Carlos Mendes → Luísa Peixoto.
  - L3 (Engenharia do produto): acionamento sob demanda para incidentes P0/P1.
- **Métricas rastreadas:**
  - Taxa de aprovação de transações (`payment_authorization.success_rate`).
  - Latência p95 do gateway (`billing_gateway.latency_p95`).
  - Taxa de erros 5xx (`billing_gateway.http_5xx_rate`).
  - Saúde de integrações externas (webhooks PSP) via `external_integrations.status`.
- **Ferramentas:** Grafana dashboards `Billing/Prod`, alertas no PagerDuty com thresholds calibrados para cada métrica, logs centralizados no Loki.

## Canais de suporte
- **PagerDuty:** rota principal para incidentes críticos com escalonamento automático L1 → L2 → L3.
- **Slack #billing-gateway-war-room:** coordenação síncrona durante incidentes e janelas de manutenção.
- **E-mail suporte@squad-platform.io:** canal assíncrono para clientes piloto registrar problemas menores.
- **StatusPage:** comunicações públicas de indisponibilidade ou degradação planejada.

## Playbooks de incidentes
- **P0 — Falha total de autorização:** seguir runbook `quality/observability/runbooks/billing-gateway-total-outage.md`, restaurar serviço em <15 min, acionar engenharia imediatamente.
- **P1 — Degradação de latência:** runbook `quality/observability/runbooks/billing-gateway-latency.md`, incluir rollback automático do release atual se p95 > 800ms por 5 min.
- **P2 — Problemas de reconciliação:** runbook `quality/observability/runbooks/billing-gateway-reconciliation.md`, coordenação com financeiro antes de comunicar clientes.
- **Checklist pós-incidente:** registrar timeline no `INCIDENT-472` e executar comunicação pós-mortem em até 48h.
