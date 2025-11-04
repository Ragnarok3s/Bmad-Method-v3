# Runbook: Escalonamento Suporte L2

## Objetivo
Garantir tratamento padronizado de incidentes que requerem suporte de segundo nível.

## Critérios para Escalonar
- Impacto em múltiplos clientes ou ambientes de produção.
- Tempo de indisponibilidade previsto maior que 30 minutos.
- Reincidência do mesmo incidente em menos de 7 dias.
- Alertas `BillingGatewayIdempotency` ou `AvailabilityDrop` ativos por mais de 10 minutos.

## Passos Operacionais
1. **Confirmar diagnóstico L1** e anexar logs relevantes (Grafana, Loki, Sentry).
2. **Abrir ticket JIRA** na fila `SUP-L2` com SLA de 30 minutos, incluindo link para `releases/<id>/README.md`.
3. **Notificar especialistas**:
   - Engenheiro Observabilidade (primary)
   - Especialista Banco de Dados (backup)
   - Engenheiro de Billing Gateway (on-call) listado em `docs/oncall/billing-gateway.md`
4. **Sincronização inicial** via standup rápido (máx. 15 minutos) registrando ações no ticket.
5. **Acionar automações** documentadas em `quality/metrics.py` para coleta de métricas.
6. **Executar check de permissões** com `scripts/compliance/lock_permissions.sh check --release <id>` antes de rollback.
7. **Atualizar comunicação com cliente** a cada 30 minutos via canal oficial.
8. **Registrar resolução** em runbook relevante (vide seção Planos de Recuperação).

## Pós-Incidente
- Executar revisão técnica em até 48h com participação do time de compliance.
- Atualizar base de conhecimento com causa raiz e ações preventivas.
- Alimentar indicadores de MTTR no dashboard de suporte e atualizar `docs/support/dr-checklist.md`.

## Contatos
- Coordenador L2: l2.coordenador@bmad.io
- Analytics On-call: analytics.support@bmad.io
- Billing Gateway On-call: billing.gateway@bmad.io
