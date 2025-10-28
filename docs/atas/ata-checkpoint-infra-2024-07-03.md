# Ata – Checkpoint Infra Sprint 0
- **Data/Horário**: 03/07/2024 14:00 BRT
- **Facilitador**: Lucas Ferreira (Platform Engineer Lead)
- **Participantes**: Ana Souza (SRE), Pedro Barros (DevOps), Camila Duarte (Security), Mariana Torres (PO), Carla Mendes (Scrum Master)

## Agenda
1. Status de provisionamento de ambientes e pipelines
2. Revisão de SLAs assinados e integrações pendentes
3. Identificação de riscos de infraestrutura e plano de mitigação

## Decisões
- Ambiente de staging ficará disponível publicamente para squads a partir de 04/07 após smoke tests; release gate aprovado. (Owner: Pedro Barros — Efetivo em 04/07/2024)
- Integração com provedor de pagamentos será priorizada no sprint backlog com suporte do time de segurança para revisão de secrets. (Owner: Camila Duarte — Revisão até 08/07/2024)
- Checkpoint infra manterá cadência bi-semanal (segundas e quartas) até o final da Sprint 1. (Owner: Lucas Ferreira — Vigência imediata)

## Ações e Responsáveis
- [ ] Executar scripts `scripts/test-unit.sh` e `scripts/test-integration.sh` no pipeline atualizado e anexar logs em `docs/integracoes/2024-07-03-smoke.md`. — Owner: Ana Souza — Due: 03/07/2024
- [ ] Documentar matriz de riscos revisada em `docs/plano-kickoff-mvp.md`. — Owner: Lucas Ferreira — Due: 05/07/2024
- [ ] Validar assinatura digital dos SLAs e publicar links no playbook operacional. — Owner: Mariana Torres — Due: 04/07/2024

## Follow-ups Anteriores
- [ ] Ajustar script de provisionamento para incluir tagging de custos — pendente para revisão em 08/07/2024.
