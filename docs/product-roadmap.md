# Product Roadmap e Backlog Inicial

## Visão Geral

Este documento define o backlog inicial e o roadmap do MVP para o produto Bmad Method v3. A proposta é orientar o time multidisciplinar sobre prioridades, alinhamento com objetivos de negócio e cadência de entrega.

## Objetivos do MVP

1. Validar a nova jornada de usuários Bmad com foco em adoção rápida.
2. Disponibilizar fluxo de gestão de agentes com configuração simplificada.
3. Entregar integrações essenciais com plataforma core de observabilidade e automações existentes.

## Backlog Inicial

> O backlog abaixo está ordenado por prioridade atualizada após a repriorização focada em housekeeping móvel. Os itens `BL-HK` devem ser concluídos antes dos demais épicos MVP.

| ID | Epic / Área | Item de Backlog | Critérios de Aceite | Dependências |
|----|-------------|-----------------|---------------------|---------------|
| BL-HK01 | Housekeeping Móvel | Disponibilizar app responsivo/offline para staff registrar status de quartos e amenities | Staff consegue atualizar tarefas em < 2 minutos, mesmo offline; sincronização automática ao recuperar conexão; histórico visível para gestores. | Design mobile; APIs de inventário; mecanismo de sincronização |
| BL-HK02 | Integrações Housekeeping-Parceiros | Conectar app de housekeeping a parceiros de lavanderia e manutenção com SLAs definidos | Agendamentos enviados com janela acordada; confirmação automática registrada; alertas para violações de SLA. | SLAs com parceiros formalizados; webhooks ou APIs de parceiros |
| BL-01 | Onboarding | Criar wizard de onboarding guiado para novos workspaces | Usuário conclui onboarding em < 5 minutos; coleta dados básicos de equipe; dispara checklist inicial. | Design UX aprovado; APIs de cadastro estáveis |
| BL-02 | Configuração de Agentes | Implementar catálogo centralizado de agentes com filtros por competência | Catálogo lista agentes com tags; filtros aplicados dinamicamente; seleção gera pré-configuração. | APIs de agentes; design system |
| BL-03 | Playbooks Automatizados | Disponibilizar biblioteca inicial de playbooks com templates pré-aprovados | Usuário seleciona playbook e inicia execução em 3 passos; logs de execução armazenados. | Mecanismo de execução de playbooks |
| BL-04 | Observabilidade | Integrar com pipeline de logs e métricas para agentes críticos | Logs enviados para stack central; dashboards default criados; alertas críticos configurados. | Ferramentas de observabilidade definidas |
| BL-05 | Governança | Configurar papéis e permissões básicas para administradores e colaboradores | Perfis administradores conseguem gerenciar agentes e playbooks; colaboradores apenas executam | Infraestrutura de identidade |
| BL-06 | Analytics | Criar painel MVP de métricas de adoção e sucesso dos agentes | Dashboard apresenta métricas diárias/semanais; exportação CSV; atualização automatizada | Pipelines de dados |
| BL-07 | Experiência | Implementar tour guiado e base de conhecimento inicial | Tour contextual por página; base de conhecimento com 5 artigos fundamentais | Conteúdo produzido |

## Roadmap MVP

### Sprint 0 — Preparação (Semana 0)
- Configurar repositório, pipelines e ambientes (ver docs/engineering-handbook.md).
- Finalizar design de experiência crítica (onboarding e catálogo).
- Confirmar que SLAs/janelas operacionais com parceiros de lavanderia/manutenção estão assinados e publicados para uso do app de housekeeping.
- Alinhar métricas de sucesso e instrumentação inicial.

### Sprint 1 — Fundamentos (Semanas 1-2)
- Entregas: BL-01, BL-05 parcialmente (perfis básicos), infraestrutura de observabilidade definida.
- Objetivos: habilitar onboarding e governança mínima.
- Métricas: taxa de conclusão onboarding ≥ 60% em ambiente interno.

### Sprint 2 — Capacidades de Agentes (Semanas 3-4)
- Entregas: BL-02, BL-03, integração inicial observabilidade (BL-04).
- Objetivos: permitir configuração e execução dos principais playbooks.
- Métricas: 5 playbooks ativos, logs centralizados com latência < 5 min.

### Sprint 3 — Analytics e Experiência (Semanas 5-6)
- Entregas: BL-06, BL-07, completar BL-05.
- Objetivos: disponibilizar insights e suporte ao usuário.
- Métricas: dashboard com 4 métricas chave; NPS interno ≥ 30.

### Marco de Lançamento MVP (Semana 6)
- Critérios: todas epics MVP concluídas; monitoração ativa; suporte inicial publicado.
- Próximos passos: planejar lote pós-MVP focado em escalabilidade e monetização.

## Governança e Aprovação do Roadmap

| Papel | Responsável Nomeado | Responsabilidades-Chave | Cadência de Revisão | Alinhamento com Calendário |
|-------|----------------------|-------------------------|---------------------|---------------------------|
| Steering Executivo | Ana Ribeiro (Product Owner) | Validar prioridades de negócio, aprovar ajustes de escopo e comunicar decisões aos stakeholders. | Quinzenal (steering committee) e checkpoints extraordinários conforme RFC. | Atualiza o roadmap após cada revisão trimestral indicada em `docs/revisao-validacao-artefatos.md`. |
| Liderança Técnica | Miguel Costa (Product Manager) & Rafael Monteiro (Tech Lead) | Avaliar impacto técnico das mudanças, garantir viabilidade das entregas e aprovar débitos técnicos associados. | Quinzenal, sincronizado com planning e retro técnica. | Confirma readiness técnico antes das datas do calendário publicado. |
| Governança de Dados & Compliance | Bianca Souza (Data & Analytics Lead) & Privacy Officer designado | Validar implicações em métricas, fontes de dados, privacidade e compliance antes de publicar alterações. | Mensal e sempre que novas métricas forem introduzidas ou checklist regulatório mudar. | Compartilha evidências no canal `#steering-bmad` e arquiva ata no Notion PMO. |

- **Processo de alteração**: qualquer proposta de repriorização deve ser registrada como RFC no repositório do produto, receber parecer técnico e de dados em até 48h úteis e somente então seguir para aprovação final da Ana Ribeiro.
- **Comunicação**: decisões aprovadas são atualizadas no roadmap e divulgadas em `#steering-bmad` com resumo do impacto e próximos passos.

## Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Dependência de integrações externas instáveis | Média | Alta | Definir contratos claros, mocks em ambientes internos, planejar testes de carga antecipados |
| Falta de dados para dashboards MVP | Alta | Média | Priorizar pipelines mínimos viáveis e usar dados sintéticos controlados inicialmente |
| Capacitação do time em novas ferramentas de observabilidade | Média | Média | Agendar workshops com time de plataforma e criar guias de uso |

## Aprovação

- Product Owner: Ana Ribeiro
- Tech Lead: Rafael Monteiro
- Data & Privacy Owners: Bianca Souza e Privacy Officer designado
