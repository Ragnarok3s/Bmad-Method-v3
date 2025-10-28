# Cadência Operacional de Revisões de Readiness

## Objetivo
Formalizar a rotina semanal de revisão de readiness para garantir visibilidade sobre backlog, ambientes, integrações e compliance, alinhando Steering Operacional, operações e squads.

## Estrutura da Cadência
| Ritmo | Reunião | Participantes | Entregáveis | Links |
| --- | --- | --- | --- | --- |
| Segunda-feira 11h | Readiness Review | Operations Manager, Tech Lead, SRE, DevOps, Security, PO | Atualização do dashboard e definição de ações prioritárias | `docs/governanca/readiness-dashboard.md` |
| Terça-feira 10h (quinzenal) | Steering Operacional | Lideranças de Produto, Operações, Plataforma, CS | Decisões estratégicas, priorização de riscos e comunicação executiva | `docs/atas/ata-steering-operacional-2024-07-09.md` |
| Sexta-feira 14h | Checkpoint Semana | Scrum Masters, Owners dos riscos, Operations Manager | Registro de métricas semanais e blockers | `docs/atas/checkpoints-semanais.md` |

## Processos-Chave
1. **Coleta de Dados (D-1)**: Owners atualizam métricas e evidências nos diretórios de origem (`docs/integracoes/`, `docs/evidencias/`).
2. **Readiness Review**: validação do índice geral e atualização do dashboard.
3. **Steering Operacional**: avalia desvios, aprova planos de mitigação e comunica stakeholders.
4. **Checkpoint Semanal**: consolida percentuais e blockers para acompanhamento contínuo.
5. **Retrospectiva Mensal (última sexta do mês)**: revisar eficácia das ações e ajustar cadência, documentar em ata dedicada.

## Checkpoints Registrados
| Data | Reunião | Principais Pontos | Ações Vinculadas |
| --- | --- | --- | --- |
| 05/07/2024 | Checkpoint Semana 0 | Dashboard inicial em construção; pendência de tagging de custos. | `docs/atas/ata-checkpoint-infra-2024-07-03.md` |
| 08/07/2024 | Readiness Review | Aprovação do template de dashboard; definição de índice ponderado. | `docs/atas/ata-readiness-review-2024-07-08.md` |
| 09/07/2024 | Steering Operacional | Priorização de integrações de pagamentos; formalização da cadência semanal. | `docs/atas/ata-steering-operacional-2024-07-09.md` |
| 12/07/2024 | Checkpoint Semana 1 | Percentuais de backlog 88%, ambientes 85%, integrações 65%; foco em smoke tests de pagamentos. | `docs/atas/checkpoints-semanais.md` |

## Próximos Passos
- [ ] Documentar retrospectiva de julho até 26/07/2024.
- [ ] Incorporar indicadores de incidentes críticos na revisão semanal a partir de 15/07/2024.
