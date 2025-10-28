# Runbook · Integrações OTA (Booking.com, Airbnb, Expedia)

Este runbook consolida janelas de manutenção, SLAs versionados e fluxos de rollback para os principais parceiros OTA operados pelo Bmad Core.

## Contatos e Escalada

| Parceiro | Contato técnico | Escalada | Horário de atendimento |
| --- | --- | --- | --- |
| Booking.com | support-tech@booking.com | +31 20 811 6284 (Nível 2) | 24x7 |
| Airbnb | integrations@airbnb.com | PagerDuty `airbnb-ota` | 06h–22h UTC |
| Expedia | lodgingsupport@expedia.com | +1 888 397 3342 (Emergency) | 24x7 |

## Janelas de manutenção

| Parceiro | Janela recorrente | Impacto esperado | Ação preventiva |
| --- | --- | --- | --- |
| Booking.com | Primeiro domingo do mês · 00h–02h UTC | API de disponibilidade indisponível | Congelar reconciliação automática, ativar fila manual.
| Airbnb | Toda terça-feira · 03h–04h UTC | Atualização de tarifas e conteúdos | Postergar push de tarifas e priorizar monitoração pós-janela.
| Expedia | Última quinta-feira do mês · 01h–03h UTC | Webhooks podem atrasar até 10 minutos | Ajustar SLA temporário para 8 min, acionar alerta se exceder 12 min.

> **Nota:** alterações extraordinárias devem ser registradas em `docs/atas/` com evidências dos impactos observados.

## SLAs versionados (vigentes)

| Parceiro | Métrica | Versão | Meta | Alerta | Quebra |
| --- | --- | --- | --- | --- | --- |
| Booking.com | Ingestão de reservas | v3 (2024-08-01) | ≤ 5 min | ≥ 6 min | ≥ 10 min |
| Airbnb | Atualização de tarifas | v2 (2024-08-18) | ≤ 4 min | ≥ 5 min | ≥ 8 min |
| Expedia | Retorno OTA | v1 (2024-09-05) | ≤ 5 min | ≥ 7 min | ≥ 10 min |

## Fluxo de rollback

1. **Congelar sincronização automática**
   - Executar script `scripts/ota/pause-sync.sh --partner <slug>`.
   - Confirmar que nenhuma nova mensagem entra na fila `ota_sync_queue`.
2. **Ativar reconciliação manual**
   - No calendário unificado (`/calendar`), alterar status das entradas impactadas para "Em reconciliação".
   - Registrar motivo e versão de SLA associada.
3. **Restaurar versão anterior**
   - Rodar `scripts/ota/sla-rollback.py --partner <slug> --version <target>`.
   - Validar em banco (`partner_sla_versions`) que `effective_to` foi atualizado corretamente.
4. **Reprocessar backlog**
   - Reativar fluxo com `scripts/ota/resume-sync.sh`.
   - Monitorar métricas `bmad_core_ota_sync_latency` e `inventory_reconciliation_queue_size` por 30 minutos.
5. **Registrar pós-mortem**
   - Atualizar este runbook com lições aprendidas.
   - Anexar métricas e logs em `docs/evidencias/`.

## Checklist pós-incidente

- [ ] SLA atual revalidado com parceiro e time jurídico.
- [ ] Fila de reconciliação sem itens pendentes > 1h.
- [ ] Dashboards Grafana (`OTA · Latência` e `Inventário · Reconciliação`) com alertas habilitados.
- [ ] Comunicação enviada para customer success e operações.

## Histórico de alterações

| Data | Autor | Versão | Notas |
| --- | --- | --- | --- |
| 2024-09-19 | Equipe Platform Ops | 1.0 | Consolidação de janelas, SLAs e rollback padronizado. |
