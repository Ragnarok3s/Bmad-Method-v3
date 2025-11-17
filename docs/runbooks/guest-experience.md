# Runbook · Jornada Digital do Hóspede

## Visão Geral

Este runbook descreve como monitorar, diagnosticar e suportar o fluxo de experiência digital do hóspede que engloba:

- Check-in digital pré-chegada
- Comunicação omnichannel (chat web, e-mail, WhatsApp)
- Ofertas de upsell durante a estadia
- Coleta de feedback/NPS pós-estadia

Os componentes principais são:

| Componente | Responsabilidade |
| --- | --- |
| `backend/services/core/communications` | Motor de templates, entregabilidade e histórico de mensagens |
| `backend/services/core/api/rest` | APIs REST `/guest-experience/*` e `/communications/*` |
| `backend/services/core/automation.py` | Sincronização de preferências e telemetria de satisfação |
| `frontend/app/guest-experience` | Painel operacional para times de experiência |
| `frontend/app/analytics` | Indicadores de jornada digital no dashboard executivo |

## Painel de Saúde

1. **API Health** – `GET /health/otel` deve retornar `status=ok`. Qualquer degradação impacta telemetria de mensagens.
2. **Resumo de entrega** – `GET /communications/delivery/summary` verifica taxas de falha e tempo médio de resposta.
3. **Jornadas ativas** – `GET /guest-experience/journey` confirma volume de hóspedes em acompanhamento e preferências sincronizadas.
4. **Dashboard** – no front-end (`/analytics`), a carta *“Jornada digital”* deve refletir satisfação e conversão.

## Procedimentos Operacionais

### Recuperar jornada específica
1. Identifique o `reservation_id` na ferramenta de reservas.
2. Consulte `GET /guest-experience/{reservation_id}` para obter etapas, mensagens e upsells.
3. No painel web, insira o ID no campo **Reserva** e clique em **Carregar**.

### Reprocessar sincronização de preferências
1. Colete os dados atualizados (ex.: preferências, estágio, NPS).
2. Envie `POST /guest-experience/journey` com `GuestJourneySnapshotRequest`.
3. Verifique se o retorno apresenta `pending=0` e monitore `guest_journey_bridge.pending()` se estiver usando modo assíncrono.

### Reenviar comunicação
1. Verifique templates com `GET /communications/templates`.
2. Execute `POST /communications/send` com o template apropriado e contexto (`reservation_id`, `journey_stage`).
3. Confirme no resumo de entrega e na timeline do hóspede.

### Registrar resposta manual do hóspede
1. Utilize `POST /communications/messages/inbound` com `channel`, `sender` e `body`.
2. Inclua `in_reply_to` para calcular o SLA de resposta.
3. Atualize a jornada com `POST /guest-experience/journey` se necessário.

## Playbooks de Incidente

| Cenário | Ação |
| --- | --- |
| Taxa de falha > 5% | Verificar credenciais de WhatsApp/e-mail, consultar logs de `record_guest_message_failure` e notificar suporte de canais |
| Sem atualizações de jornada | Validar se automação recebe payload (checar filas via `automation_queue.pending()`); reenviar snapshot |
| Métrica de satisfação zerada | Confirmar fluxo de feedback (ver se `guest_post_stay_feedback` foi enviado) e disparar manualmente |
| Upsells sem resposta | Revisar oferta atual, enviar follow-up com contexto `upsell_offer`, acionar equipe comercial |

## KPIs e Alertas

- **Satisfação alvo** ≥ 4,5 (escala 0-10).
- **Tempo médio de resposta** ≤ 10 minutos.
- **Conversão de upsell** ≥ 18%.
- Alertas configurados via `record_dashboard_guest_experience` alimentam observabilidade e devem disparar em caso de tendência de queda por três janelas consecutivas.

## Pós-Incidência

1. Registrar causa raiz e ações em `docs/incidents/` (quando aplicável).
2. Atualizar este runbook se houver novos templates, canais ou automações.
3. Compartilhar aprendizados com squads de Atendimento e Produto.
