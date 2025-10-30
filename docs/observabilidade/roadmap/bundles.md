# Roadmap de Observabilidade — Bundles

## SLOs de adoção mínima

- **SLO 1 — Views semanais activas:** cada bundle estratégico deve acumular pelo menos **350 visualizações únicas** em rolling window de 7 dias (`increase(bmad_web_bundle_view_total[7d])`).
- **SLO 2 — Conversão lançamento/view:** a taxa de conversão `launch_count / view_count` calculada via API `/bundles/usage?granularity=weekly` deve permanecer **>= 0.25** durante duas semanas consecutivas.
- **SLO 3 — Latência para activação:** o P95 da métrica `bmad_core_bundle_activation_lead_time_hours` deve ficar **< 12 h** em ambiente de produção.

## Alertas recomendados

| Métrica | Condição | Severidade | Acção |
| --- | --- | --- | --- |
| `increase(bmad_web_bundle_view_total{bundle_id="${bundle}"}[7d])` | < 350 durante 48h | Major | Notificar equipa de produto para revisão de copy/CTA. |
| `increase(bmad_web_bundle_launch_total{workspace="$workspace"}[24h])` | = 0 para workspaces activos | Critical | Abrir incidente no canal `#bmad-oncall` e validar integrações. |
| `histogram_quantile(0.95, sum(rate(bmad_core_bundle_activation_lead_time_hours_bucket[15m])) by (le, bundle_id))` | > 12 | Warning | Solicitar revisão do funil de activação e confirmar automações. |
| API `/bundles/usage` | `totals.launch_count = 0` durante 3 dias | Warning | Escalar para CX para recolher feedback de clientes. |

## Instrumentação suportada

- Front-end emite eventos `bundle_view` e `bundle_launch` via `bmad_web_bundle_view_total` e `bmad_web_bundle_launch_total` com atributo `workspace`.
- Core agrega `BundleUsageMetric` (tabela homónima) e exporta `bmad_core_bundle_activation_total` e `bmad_core_bundle_activation_lead_time_hours`.
- Dashboard de referência: `grafana/analytics/bundles-observability.json` com filtros de workspace/bundle.

## Próximos passos

1. Integrar ingestão automática dos eventos de bundle na plataforma de dados (stream Kafka + Lakehouse). 
2. Habilitar alertas no Grafana OnCall com rota específica para equipa de produto. 
3. Publicar reporte mensal de adoção usando o endpoint `/bundles/usage` como fonte primária.
