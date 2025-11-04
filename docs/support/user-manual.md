# Manual de Suporte - DR e Escalonamento

## Contexto
Este manual complementa o `manual-do-usuario.md` com foco em continuidade de negócios. Foi realizada revisão dos fluxos atuais e identificadas lacunas relacionadas a Disaster Recovery (DR) e escalonamento para suporte L2.

## Lacunas Identificadas
- Ausência de checklist formal de DR por release (resolvido neste repositório em `docs/support/dr-checklist.md`).
- Falta de referência explícita aos runbooks de recuperação e escalonamento (endereçado abaixo).
- Necessidade de confirmação de comunicação com stakeholders pós-incidente (pendente automatização no playbook de incidentes).

## Planos de Recuperação
- Seguir o **Runbook de Recuperação de Desastres** localizado em `quality/observability/runbooks/disaster-recovery.md`.
- Mapear serviços críticos utilizando o inventário `docs/observability-stack.md` antes de iniciar a restauração.
- Validar integridade de dados conforme procedimentos descritos em `quality/pci.py` e registrar evidências em `quality/reports/`.

## Escalonamento para Suporte L2
1. Revisar critérios definidos no runbook `quality/observability/runbooks/escalation-l2.md`.
2. Abrir ticket na fila `SUP-L2` com o template padrão (impacto, tempo estimado, serviços afetados).
3. Registrar bridge de comunicação e notificar os contatos de DR listados no runbook de recuperação.
4. Atualizar status a cada 30 minutos até estabilização, anexando prints dos dashboards de observabilidade.

## Pós-Incidente
- Registrar lições aprendidas em até 48h no repositório `quality/reports/`.
- Garantir atualização do checklist de DR da release corrente.
- Validar que os requisitos de comunicação e compliance foram cumpridos com o time de segurança.

## Próximos Passos
- Automatizar disparo de comunicação via Slack/Teams durante ativação de runbooks.
- Integrar métricas de MTTR/MTBF diretamente no dashboard de suporte.
- Atualizar este manual a cada release após revisão da equipe de suporte.
