# Runbook: Escalonamento Suporte L2

## Objetivo
Garantir tratamento padronizado de incidentes que requerem suporte de segundo nível.

## Critérios para Escalonar
- Impacto em múltiplos clientes ou ambientes de produção.
- Tempo de indisponibilidade previsto maior que 30 minutos.
- Reincidência do mesmo incidente em menos de 7 dias.

## Passos Operacionais
1. **Confirmar diagnóstico L1** e anexar logs relevantes (Grafana, Loki, Sentry).
2. **Abrir ticket JIRA** na fila `SUP-L2` com SLA de 30 minutos.
3. **Notificar especialistas**:
   - Engenheiro Observabilidade (primary)
   - Especialista Banco de Dados (backup)
4. **Sincronização inicial** via standup rápido (máx. 15 minutos) registrando ações no ticket.
5. **Acionar automações** documentadas em `quality/metrics.py` para coleta de métricas.
6. **Atualizar comunicação com cliente** a cada 30 minutos via canal oficial.
7. **Registrar resolução** em runbook relevante (vide seção Planos de Recuperação).

## Pós-Incidente
- Executar revisão técnica em até 48h.
- Atualizar base de conhecimento com causa raiz e ações preventivas.
- Alimentar indicadores de MTTR no dashboard de suporte.

## Contatos
- Coordenador L2: l2.coordenador@bmad.io
- Analytics On-call: analytics.support@bmad.io
