# Backlog de Riscos – Operação Pós Handoff

| ID | Risco/Lacuna | Impacto | Probabilidade | Sinais de Alerta | Plano de Mitigação | Responsável | Próxima Revisão |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | Rollback não automatizado em homologação | Alto – pode atrasar correções críticas | Médio | Falhas de deploy com intervenção manual | Implementar scripts automatizados e testar nos pipelines de staging | Tech Lead & SRE | 15/07/2024 |
| R2 | Governança de acessos ao cofre de segredos incompleta | Alto – risco de vazamento ou indisponibilidade | Médio | Acessos sem revisão, logs inconsistentes | Revisão de acessos quinzenal, implantação de MFA e registro de auditoria | SRE | 10/07/2024 |
| R3 | Alertas sem owner definido gerando fadiga | Médio – perda de visibilidade operacional | Alto | Alertas recorrentes não tratados em 48h | Revisar matriz de ownership e ajustar thresholds em cadência semanal | Analista de Observabilidade | 17/07/2024 |
| R4 | RACI desatualizado para governança | Médio – decisões sem clareza de accountability | Médio | Reuniões sem responsáveis claros, pendências não atribuídas | Atualizar RACI, publicar em docs/governanca e validar em comitê mensal | Chapter Lead Engenharia | 12/07/2024 |
| R5 | Métricas de qualidade insuficientes nas pipelines | Médio – risco de regressões em produção | Médio | Falhas de testes tardias, ausência de métricas visíveis | Expandir cobertura de testes e reportar indicadores semanalmente | QA Lead | 11/07/2024 |

## Observações
- Revisar este backlog em todos os checkpoints definidos em `docs/operacao/cadencia.md`.
- Mover riscos mitigados para histórico e manter evidências em `docs/evidencias/`.
