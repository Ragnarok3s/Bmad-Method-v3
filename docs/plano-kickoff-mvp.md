# Plano de Kick-off da Fase de Implementação do MVP

## Objetivo
Estabelecer o arranque coordenado da fase de implementação do MVP da plataforma de gestão de alojamentos locais, garantindo que as lacunas identificadas na revisão sejam endereçadas e que a equipa tenha responsabilidades, cronograma e critérios de sucesso claros.

## Premissas e Critérios de Pronto
- Confirmação de que os artefatos estratégicos foram validados, com exceção das ações corretivas listadas abaixo.【F:docs/revisao-validacao-artefatos.md†L5-L66】【F:docs/revisao-validacao-artefatos.md†L68-L108】
- Aprovação executiva dos documentos estratégicos (roadmap, plano MVP, guias operacionais) após atribuição de owners e datas de revisão.【F:docs/revisao-validacao-artefatos.md†L68-L99】【F:docs/revisao-validacao-artefatos.md†L125-L133】
- Equipa comprometida com calendário de sprints quinzenais, com capacidade alocada e cobertura de QA/DevOps definida.

## Responsabilidades Principais
| Área | Responsável | Escopo |
| --- | --- | --- |
| Produto | Product Owner (PO) | Priorizar backlog, validar entregáveis com stakeholders e atualizar roadmap pós-MVP. |
| Engenharia | Engineering Lead | Coordenar desenvolvimento, garantir práticas de GitOps e automações pendentes. |
| QA | QA Lead | Definir e monitorizar quality gates por sprint, incorporar testes de segurança. |
| DevOps | Platform Engineer | Completar templates/scripts de CI/CD, configurar observabilidade e runbooks. |
| UX/Design | Design Lead | Garantir acessibilidade nos protótipos e preparar hand-off detalhado. |
| Operações | Operations Manager | Atualizar playbook com matriz RACI e planos de comunicação. |

## Cronograma de Kick-off (6 Semanas)
| Semana | Foco | Entregáveis |
| --- | --- | --- |
| Semana 0 (Kick-off) | Sessões de alinhamento, revisão de backlog, definição de Definition of Ready (DoR) e Definition of Done (DoD). | Ata de kick-off com decisões, backlog priorizado e DoR/DoD publicados. |
| Semana 1 | Execução das ações corretivas críticas; setup de ambientes e pipelines. | Templates de PR e CODEOWNERS ativos, CI executando `scripts/test-unit.sh`/`scripts/test-integration.sh`, política de rollback/versionamento publicada e owners de dashboards/runbooks validados. |
| Semana 2 | Sprint 0 – construção de fundações técnicas e casos de uso prioritários (autenticação, inventário). | Deploy do ambiente de staging, histórias base concluídas com QA integrado. |
| Semana 3 | Sprint 1 (parte 1) – funcionalidades de reservas e calendário; iniciação de testes E2E. | Incremento com reservas básicas, testes E2E em pipeline e métricas configuradas. |
| Semana 4 | Sprint 1 (parte 2) – integrações externas (OTA/pagamentos) com critérios de privacidade. | Integrações em staging com checklist LGPD/GDPR validado. |
| Semana 5 | Retro e planeamento Sprint 2; revisão das métricas de sucesso e atualização do roadmap. | Relatório de sprint, métricas de KPIs operacionais e plano Sprint 2 com dependências mapeadas. |

## Ações Corretivas Obrigatórias
1. **Governança**: nomear owners dos documentos estratégicos e publicar calendário trimestral de revisão.【F:docs/revisao-validacao-artefatos.md†L68-L88】【F:docs/revisao-validacao-artefatos.md†L125-L133】
2. **Compliance**: acrescentar seções de privacidade e checklist regulatório no plano MVP e na estratégia de testes, incluindo critérios de armazenamento seguro de dados sensíveis.【F:docs/revisao-validacao-artefatos.md†L94-L116】【F:docs/revisao-validacao-artefatos.md†L118-L143】
3. **DevOps**: concluir templates e scripts pendentes, além de formalizar política de rollback e versionamento de infraestrutura.【F:docs/revisao-validacao-artefatos.md†L108-L118】
4. **Observabilidade**: atribuir ownership de dashboards/runbooks e definir processo de revisão de custos e alertas.【F:docs/revisao-validacao-artefatos.md†L126-L137】
5. **UX e Operações**: integrar checklist de acessibilidade aos protótipos e documentar matriz RACI e critérios de priorização para expansão (**Concluída Semana 1** – ver `design/hospitality-ux/prototipo-interativo.md` e `docs/playbook-operacional.md`).【F:docs/revisao-validacao-artefatos.md†L137-L159】

As ações acima devem ser concluídas até ao final da Semana 1 para não bloquear o arranque do Sprint 0. O calendário trimestral de revisão e o quadro de acompanhamento das ações corretivas estão publicados em `docs/revisao-validacao-artefatos.md` e devem ser utilizados como referência única para status e decisões de governance.

## Roteiro de Comunicação e Sincronização
- **Daily Stand-up**: 15 minutos por squad, com sincronização inter-squads semanal conduzida pelo Operations Manager.
- **Reuniões Semanais**:
  - Reunião de steering committee (PO, Engineering Lead, Operations Manager) para avaliar progresso, riscos e métricas.
  - Revisão de QA/DevOps para acompanhar qualidade das pipelines e testes de segurança.
- **Canais**: utilizar canal dedicado no Slack/Teams para incidentes, com escalonamento documentado no playbook operacional.

## Métricas de Sucesso Inicial
- Time-to-Deploy médio inferior a 1 dia em ambiente de staging.
- Cobertura de testes unitários ≥ 65% e integração ≥ 50% até final da Sprint 1.
- 100% das histórias críticas entregues com critérios de privacidade e acessibilidade validados.
- Zero incidentes críticos sem owner e runbook associados.

## Próximas Decisões Gate
- **Go/No-Go Sprint 0**: confirmar conclusão das ações corretivas e disponibilidade de ambientes.
- **Go/No-Go Sprint 1**: validar checklist de conformidade e readiness das integrações.
- **Revisão Pós-Sprint 1**: decidir sobre aceleração de roadmap pós-MVP ou ajustes de capacidade.

## Anexos e Referências
- Relatório de revisão: `docs/revisao-validacao-artefatos.md`
- Roadmap: `docs/product-roadmap.md`
- Plano MVP: `docs/property-mvp-plan.md`
- Estratégia de testes: `docs/testing-strategy.md`
- Playbook operacional: `docs/playbook-operacional.md`
