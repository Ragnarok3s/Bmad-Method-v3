# Ata – Readiness Review Semanal
- **Data/Horário**: 08/07/2024 11:00 BRT
- **Facilitador**: Júlia Martins (Operations Manager)
- **Participantes**: Rafael Monteiro (Tech Lead), Ana Souza (SRE), Camila Duarte (Security), Pedro Barros (DevOps), Laura Pinto (Design Lead), Mariana Torres (PO)

## Agenda
1. Revisar template do dashboard de readiness e indicadores mínimos
2. Atualizar status de backlog, ambientes, integrações e compliance
3. Definir ações prioritárias até o checkpoint de 12/07

## Decisões
- Aprovar publicação do dashboard de readiness em `docs/governanca/readiness-dashboard.md` seguindo template consolidado.
- Utilizar média ponderada dos pilares (40% backlog, 30% ambientes, 20% integrações, 10% compliance) para reportar o índice geral.
- Padronizar evidências de testes de integrações críticas em arquivos dedicados sob `docs/integracoes/` com logs anexados.

## Ações e Responsáveis
- [ ] Atualizar `docs/atas/checkpoints-semanais.md` com os dados do checkpoint de 08/07 — Owner: Mariana Torres — Due: 09/07/2024.
- [ ] Consolidar status das integrações de pagamentos e publicar massa de teste mascarada — Owner: Camila Duarte — Due: 10/07/2024.
- [ ] Registrar plano de mitigação dos riscos atualizados no documento de roadmap — Owner: Rafael Monteiro — Due: 09/07/2024.

## Follow-ups Anteriores
- [x] Publicação do template do dashboard alinhado com governança.
- [x] Evidências de retenção automatizada consolidadas em 07/11/2025 (`docs/evidencias/compliance/retencao-automatica-2025-11.md`) com parecer jurídico anexado e comunicação registrada ao comitê.

## Atualização 07/11/2025

- Comitê de readiness informado via canal `#governanca-readiness` sobre a conclusão das ações A2 (retenção) e A4 (observabilidade/FinOps), com links para o runbook atualizado e para o parecer jurídico em `docs/evidencias/compliance/parecer-juridico-retencao-2025-11.md`.
