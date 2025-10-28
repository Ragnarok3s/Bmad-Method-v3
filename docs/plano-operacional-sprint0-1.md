# Plano Operacional de Arranque (SLAs, Kick-off, Sprint 0 e Sprint 1)

## Objetivo
Estabelecer a cadência operacional das primeiras quatro semanas pós-go/no-go, garantindo que as negociações de SLAs, o kick-off formal e as primeiras sprints (0 e 1) ocorram com entregáveis e responsáveis claramente definidos.

## Visão Geral de Eventos Obrigatórios
| Evento | Janela | Owner | Participantes-Chave | Preparação | Resultados Esperados |
| --- | --- | --- | --- | --- | --- |
| Negociação e assinatura de SLAs com parceiros críticos | Semana -1 a Semana 0 | Operations Manager | Jurídico, Procurement, Leads de Facilities e Housekeeping | Consolidar requisitos de serviço, limites de SLA e matriz de risco; preparar propostas padrão | SLAs assinados e arquivados no repositório operacional (`docs/playbook-operacional.md`), matriz RACI atualizada e plano de mitigação de riscos acionado |
| Sessão de Kick-off técnico e operacional | Dia 1 da Semana 0 | Engineering Lead + PO | Todos os leads de disciplina, stakeholders executivos | Agenda distribuída com 48h de antecedência, backlog priorizado e critérios DoR/DoD prontos | Ata publicada, backlog priorizado validado, plano de comunicação revisto, próximos passos acordados |
| Sprint 0 – Planning e Execução | Dias 2-10 da Semana 0/1 | Scrum Master | Equipa de produto e engenharia, QA, DevOps | Backlog de fundações técnicas preparado, definição de ambientes, scripts de infraestrutura testados | Ambientes configurados, pipelines CI/CD operacionais, histórias fundacionais concluídas com QA |
| Sprint 1 – Planning e Execução | Dias 11-24 (Semanas 2-3) | Scrum Master | Equipa de produto, engenharia, QA, Ops | Backlog com foco em reservas, integrações e conformidade revisto; dependências mapeadas | Funcionalidades core em staging, integrações validadas, métricas e alertas configurados |

## Cronograma e Marcos de Controlo
| Semana | Eventos Principais | Entregáveis Obrigatórios | Critérios de Aceitação |
| --- | --- | --- | --- |
| Semana -1 | Preparação de propostas de SLA, recolha de requisitos, pré-alinhamento com parceiros | Rascunhos de SLA, matriz de riscos e plano de negociação | Versão preliminar validada por Jurídico; riscos priorizados com owners |
| Semana 0 | Assinatura de SLAs, sessão de kick-off, setup inicial de ambientes | SLAs publicados, ata de kick-off, checklist de readiness de staging | Documentos em repositório partilhado; checklist de readiness ≥ 90% completo |
| Semana 1 | Execução Sprint 0; configuração de pipelines e ambientes | Backlog fundacional entregue, ambientes configurados e validados | Pipelines CI/CD executam scripts `scripts/test-unit.sh` e `scripts/test-integration.sh` sem bloqueios; ambientes com smoke tests aprovados |
| Semana 2 | Sprint 1 – foco em reservas e calendário; testes E2E iniciais | Incremento com reservas básicas e métricas iniciais | Histórias priorizadas com DoD cumprido; dashboards básicos publicados em `docs/observability-stack.md` |
| Semana 3 | Sprint 1 – integrações externas e privacidade | Integrações OTA/pagamentos testadas, checklist LGPD/GDPR atualizado | Logs de testes de integração anexados; checklist de conformidade assinado pelo DPO |

## Atualização de Status – 07/07/2024
| Evento | Situação Atual | Evidências |
| --- | --- | --- |
| Kick-off técnico e operacional | Realizado em 01/07; backlog Sprint 0/1 validado e cadência de checkpoints confirmada. | Ata `docs/atas/ata-kickoff-sprint0-2024-07-01.md`; roadmap atualizado em andamento |
| Checkpoint Infra #1 | Concluído em 03/07 com aprovação do ambiente de staging e plano de riscos atualizado. | Ata `docs/atas/ata-checkpoint-infra-2024-07-03.md`; criação da pasta `docs/integracoes/` |
| Observability Standup #1 | Realizado em 05/07; definidos owners e prazos para dashboards e alertas críticos. | Ata `docs/atas/ata-observability-standup-2024-07-05.md`; pendência de publicação do dashboard até 08/07 |
| SLAs críticos | Assinaturas finalizadas e arquivadas; aguardando validação digital no playbook. | Referências em `docs/evidencias/sla-operacionais-2024-07.md` e ação aberta no checkpoint infra |

## Mecanismo de Monitorização Semanal
- **Ritmo:** checkpoint às sextas-feiras conduzido pelo Scrum Master com participação do PO, QA Lead e Platform Engineer.
- **Checklist de outputs:**
  - Backlog priorizado e atualizado no final de cada planning (armazenado em `docs/product-roadmap.md`).
  - Ambientes e pipelines: confirmação de execução verde dos scripts `scripts/test-unit.sh` e `scripts/test-integration.sh`; registo no log de release (`docs/engineering-handbook.md`, secção de cadência de deploys).
  - Integrações: evidências de testes (logs/export) anexadas em pasta `docs/integracoes/` (criar se inexistente) com resumo na ata semanal.
- **Dashboard de Status:** atualizar `docs/metricas-kpis-dashboard.md` com indicadores de readiness (% backlog priorizado, % ambientes configurados, % integrações testadas).
- **Gestão de Riscos:** revisão contínua das ações corretivas descritas em `docs/plano-kickoff-mvp.md` e `docs/revisao-validacao-artefatos.md`.

## Normas de Documentação de Atas e Checkpoints
1. **Localização padrão:** diretório `docs/atas/` (criar se ainda não existir) com convenção `YYYY-MM-DD-nome-reuniao.md`.
2. **Template mínimo:** disponível em `docs/templates/ata.md` e resumido abaixo.
   - Objetivo da reunião e participantes.
   - Decisões tomadas e responsáveis.
   - Ações e deadlines (YYYY-MM-DD) com owner explícito.
   - Riscos/impedimentos e plano de mitigação.
   - Ligações para evidências (backlog, dashboards, logs de teste).
3. **Visibilidade:** link para cada ata partilhado no canal de operações (Slack/Teams) e referenciado em `docs/playbook-operacional.md` na secção de governança.
4. **Checkpoints rápidos (async):** registar resumo em `docs/atas/checkpoints-semanais.md` com tabela de status (Semanas 0-3, percentuais de completude, blockers).

## Gestão de Dependências e Comunicação
- **Integração com parceiros externos:** garantir envio de cronograma e SLAs assinados aos parceiros via e-mail corporativo, com confirmação arquivada.
- **Comunicação interna:** manter agenda das sessões em calendário partilhado; enviar lembrete 24h antes com link para ata em branco.
- **Escalonamento:** blockers críticos devem ser escalados ao steering committee em até 4h após identificação (ver `docs/playbook-operacional.md`).

## Próximos Passos Imediatos
1. Nomear owners para criação das pastas `docs/atas/` e `docs/integracoes/` e publicar instruções no canal.
2. Confirmar disponibilidade dos stakeholders para a janela da negociação de SLAs e reservar salas/links.
3. Atualizar `docs/product-roadmap.md` com versão priorizada para Sprint 0 e Sprint 1 até 48h antes do kick-off.
4. Preparar template de ata reutilizável e incluí-lo no repositório até ao final da Semana -1.
