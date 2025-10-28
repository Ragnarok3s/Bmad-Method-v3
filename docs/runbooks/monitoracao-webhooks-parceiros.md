# Runbook — Monitoramento de Webhooks de Parceiros

## Objetivo
Garantir visibilidade e resposta rápida a falhas nas integrações de lavanderia e manutenção utilizadas pelo app de housekeeping.

## Webhooks Monitorados
| Parceiro | Endpoint | SLA | Responsável |
| -------- | -------- | --- | ----------- |
| Lavanderia Brilho | `/partners/laundry/v1/events` | Ack ≤ 60s | Gabriela Nunes (Parcerias) |
| Manutenção Ágil | `/partners/maintenance/v1/events` | Ack ≤ 90s | Thiago Ramos (Facilities) |

## Alertas
- **WebhookDeliveryFailure** (PagerDuty): disparado após 3 falhas consecutivas > SLA.
- **WebhookPayloadInvalid** (Slack `#hk-alerts`): triggered por validação de esquema.

## Procedimento
1. **Identificar Falha**
   - Verificar dashboards `Partner Webhooks` em Grafana.
   - Confirmar logs no índice Kibana `partner-webhooks-*`.
2. **Mitigação Inicial**
   - Reprocessar payload via `/replay` conforme instruções do parceiro.
   - Atualizar status no canal `#hk-ops` com resumo do incidente.
3. **Escalonamento**
   - Acionar Owner indicado na tabela.
   - Notificar Operations Manager se MTTR estimado > 30 minutos.
4. **Follow-up**
   - Registrar incidente em `docs/atas/ata-incident-<data>.md`.
   - Atualizar lições aprendidas na próxima retro técnica.

## Métricas
- Taxa de entrega bem-sucedida ≥ 99% semanal.
- Tempo de detecção < 5 minutos.

## Referências
- SLAs assinados: `docs/evidencias/sla-operacionais-2024-07.md`.
- Plano MVP Housekeeping: `docs/property-mvp-plan.md`.
