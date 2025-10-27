# Consolidado de Feedback das Partes Interessadas

## Objetivo
Documentar o processo de recolha de feedback dos stakeholders principais após a validação dos artefatos do MVP, garantindo alinhamento antes do arranque da implementação e destacando ajustes prioritários.

## Stakeholders Envolvidos
- **Proprietários/Investidores**: foco em retorno financeiro, conformidade legal e diferenciais competitivos.
- **Equipa Operacional**: gestores de propriedades, equipa de housekeeping e suporte ao hóspede que dependem de fluxos diários eficientes.
- **Parceiros Técnicos**: integrações com OTAs, pagamentos e fornecedores de automação.
- **Equipa de Produto e Engenharia**: responsáveis por executar o plano MVP e absorver feedback contínuo.

## Pré-Levantamento
1. **Material de Referência Enviado** (D-3): roadmap, plano MVP, estratégia de testes, métricas e plano operacional.【F:docs/product-roadmap.md†L1-L111】【F:docs/property-mvp-plan.md†L1-L89】【F:docs/testing-strategy.md†L1-L129】【F:docs/playbook-operacional.md†L1-L175】
2. **Questionário Assíncrono** (D-2): recolha de expectativas, principais riscos percebidos e temas para debate na sessão síncrona.
3. **Resumo Executivo** (D-1): partilha das principais conclusões preliminares do relatório de revisão e validação para enquadrar a discussão.【F:docs/revisao-validacao-artefatos.md†L1-L88】

## Sessão de Alinhamento (DIA 0)
- **Duração**: 75 minutos (remota, gravação disponível).
- **Agenda**:
  1. Boas-vindas e objetivo (5 min)
  2. Recapitulação dos entregáveis e principais decisões (10 min)
  3. Feedback por stakeholder (30 min)
     - Proprietários/Investidores
     - Equipa Operacional
     - Parceiros Técnicos
  4. Priorização de ajustes e definição de responsáveis (20 min)
  5. Próximos passos e confirmação de calendário (10 min)
- **Materiais de apoio**: mural colaborativo com tópicos de feedback, dashboard de métricas em construção e matriz RACI preliminar.

## Feedback Consolidado
### Proprietários/Investidores
- Reforçar visibilidade sobre **previsões financeiras** e impacto das integrações premium antes do final da Sprint 2.
- Solicitar **cronograma de compliance** detalhando marcos de LGPD/GDPR e certificações necessárias.

### Equipa Operacional
- Priorizar funcionalidades de **gestão de housekeeping** e turnos com notificações móveis na Sprint 1.
- Ajustar onboarding de novos colaboradores com guias visuais e checklists orientados por função.

### Parceiros Técnicos
- Necessidade de **janelas de manutenção coordenadas** para integrações OTA e gateway de pagamento.
- Pedido de clarificação sobre **SLAs de suporte** e responsabilidades em incidentes multi-fornecedor.

### Equipa de Produto e Engenharia
- Sublinhar dependência de concluir templates de PR, scripts de automação e quality gates antes da Sprint 0.【F:docs/engineering-handbook.md†L117-L128】【F:docs/testing-strategy.md†L69-L129】
- Solicitar aprovação rápida das métricas de sucesso para ativar instrumentação desde o desenvolvimento inicial.【F:docs/metricas-kpis-dashboard.md†L1-L84】

## Ajustes Prioritários
1. **Compliance & Segurança de Dados** (Criticidade Alta)  
   - Produzir plano detalhado com marcos regulatórios, responsáveis e documentação exigida até D+7.
2. **Housekeeping & Operações de Campo** (Criticidade Alta)  
   - Antecipar implementação de notificações mobile, fluxos de tarefas e relatórios de viragem para Sprint 1.1.
3. **Governança Técnica** (Criticidade Média-Alta)  
   - Fechar templates de PR, scripts CI/CD e matriz de quality gates antes do kickoff técnico (D+5).
4. **Coordenação com Parceiros** (Criticidade Média)  
   - Definir calendário trimestral de janelas de manutenção e estabelecer SLAs conjuntos até D+10.

## Plano de Ação Pós-Sessão
| Nº | Ação | Owner | Prazo | Dependências | Status Inicial |
|----|------|-------|-------|---------------|----------------|
| 1 | Elaborar plano de compliance e validar com jurídico | Product Ops | D+7 | Roadmap regulatório, parceiros legais | Em curso |
| 2 | Atualizar backlog com épicos de housekeeping priorizados e critérios de aceite móveis | Product Manager | D+3 | Feedback operacional | Não iniciado |
| 3 | Publicar templates de PR, scripts CI/CD e quality gates mínimos | Engenharia | D+5 | Equipa DevOps | Em curso |
| 4 | Formalizar SLAs e calendário de manutenção com parceiros técnicos | Alianças Estratégicas | D+10 | Contatos OTA/pagamentos | Não iniciado |
| 5 | Preparar material visual para onboarding operacional | Customer Success | D+6 | UX/UI, manual do usuário | Planeado |

## Comunicação e Seguimento
- **Resumo da Sessão**: enviado D+1 com decisões, ações e gravação.
- **Reuniões de Seguimento**: checkpoints semanais (30 min) até concluir ações críticas.
- **Canal Contínuo**: espaço dedicado no Slack (#stakeholders-mvp) para dúvidas e sinalização de riscos.
- **Métrica de Sucesso**: % de ações críticas concluídas dentro do prazo (objetivo ≥ 90%) e NPS dos stakeholders ≥ 8 após Sprint 1.

## Riscos e Mitigações
- **Atraso em aprovações de compliance** → Escalar para consultoria externa caso pendências se prolonguem além de D+10.
- **Sobrecarga da equipa de engenharia** → Ajustar capacidade da Sprint 0, priorizando itens técnicos críticos e despriorizando funcionalidades não essenciais.
- **Dependências de parceiros externos** → Estabelecer planos B (ex.: integrações manuais temporárias) e definir responsáveis de contacto.

## Próximos Passos
1. Monitorizar execução do plano de ação nas dailies e no dashboard de métricas.
2. Validar entrega dos ajustes prioritários durante a revisão da Sprint 1.
3. Recolher novo feedback estruturado na retro da Sprint 1 para aferir eficácia das correções.

