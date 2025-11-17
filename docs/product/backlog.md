# Backlog de Produto — Página de Agentes

## Auditoria de 2025-02-17

### Escopo
- Itens avaliados: épico `BL-02 Configuração de Agentes` do roadmap e issue "Feedback insuficiente e acessibilidade limitada na página de agentes".
- Implementação verificada: rota `/agentes` do front-end web (`frontend/app/agentes/page.tsx`).

### Resumo da verificação
- O épico `BL-02` foi **concluído** na variante em português após alinhar a rota `/agentes` ao catálogo dinâmico (`useAgentsCatalog`, filtros, paginação e telemetria) reutilizado de `/agents`. O catálogo agora integra filtros acessíveis, paginação focável e instrumentação de bundles.【F:frontend/components/agents/AgentsCatalogView.tsx†L1-L236】【F:frontend/app/agentes/page.tsx†L1-L36】
- A issue de acessibilidade foi **encerrada** com a introdução de alertas com foco automático, botões com foco visível e componentes reutilizáveis documentados nos testes de regressão.【F:frontend/components/agents/AgentActionButton.tsx†L1-L63】【F:frontend/app/agentes/__tests__/AgentesPage.test.tsx†L1-L115】

### Evidências da entrega `BL-02`
- **Catálogo dinâmico**: `/agentes` partilha a mesma infraestrutura de catálogo da rota em inglês, com filtros, paginação e telemetria OTel/Analytics acionadas conforme os critérios T1.【F:frontend/components/agents/AgentsCatalogView.tsx†L42-L209】【F:frontend/app/agentes/page.tsx†L1-L36】
- **Filtros e alertas acessíveis**: `AgentsFilters` continua a anunciar filtros ativos e agora é reutilizado na rota localizada, garantindo paridade de UX e acessibilidade.【F:frontend/components/agents/AgentsCatalogView.tsx†L112-L150】【F:frontend/components/agents/AgentsFilters.tsx†L1-L172】
- **Pré-configuração acionável**: o botão reutilizável aciona métricas `bundle_view`/`bundle_launch`, respeitando estados de carregamento e foco visível exigidos pelo T3.【F:frontend/components/agents/AgentsCatalogView.tsx†L70-L107】【F:frontend/components/agents/AgentActionButton.tsx†L1-L63】

### Issues relacionadas
| Issue | Situação | Evidência |
|-------|----------|-----------|
| `docs/issues/agents-page-feedback-a11y.md` | Encerrada; alertas com foco automático, resumo `aria-live` e testes RTL + `axe` documentados na variante localizada. | 【F:docs/issues/agents-page-feedback-a11y.md†L1-L84】【F:frontend/app/agentes/__tests__/AgentesPage.test.tsx†L1-L115】 |

## Plano de ação atualizado

| ID | Descrição | Critérios de aceite atualizados | Dependências | Status |
|----|-----------|---------------------------------|--------------|--------|
| BL-02-T1 | Unificar `/agentes` com o catálogo dinâmico (`useAgentsCatalog`, `AgentsFilters`, paginação, telemetria de bundles) garantindo paridade funcional com `/agents`. | Catálogo reutiliza os mesmos hooks, filtros e telemetria (`bundle_view`/`bundle_launch`) com foco automático nas mudanças de página. | API de agentes disponível; componentes compartilhados existentes (`AgentsFilters`, `StatusBadge`, `ResponsiveGrid`). | Concluído |
| BL-02-T2 | Adicionar suíte de testes e verificações de acessibilidade para `/agentes`, espelhando cenários validados em `/agents`. | Testes RTL + `jest-axe` cobrem erro, vazio, paginação e verificam foco/aria-live para alertas e resumo de navegação. | Dependência de `jest-axe` e utilitários já usados na rota inglesa. | Concluído |
| BL-02-T3 | Extrair o botão de ação (`retry/launch`) para componente reutilizável com estados `loading` e `disabled`, aplicando estilos consistentes e foco visível. | Componente `AgentActionButton` aplica estados `loading/disabled`, foco visível e variantes compartilhadas entre `/agents` e `/agentes`. | Design system e tokens existentes. | Concluído |

## Priorização pós-lançamento de curto prazo

| Ordem | Item | Justificativa | Aprendizado esperado |
|-------|------|---------------|----------------------|
| 1 | BL-02-T1 | Resolverá principais bloqueios identificados com clientes piloto sobre filtros e telemetria, permitindo medir adoção real após checkpoints de 19/07 e 22/07. | Validar se catálogo dinâmico suporta cenários de alto volume reportados por Fintech Álamo e Banco Solaris. |
| 2 | BL-02-T3 | Melhorar experiência dos callbacks e ações rápidas antes do teste de contingência em 29/07. | Observar impacto no tempo médio de resposta e clareza de ações durante simulado com Coop CredMais. |
| 3 | BL-02-T2 | Garantir sustentabilidade após estabilização das primeiras métricas e antes da revisão de 02/08. | Confirmar redução de regressões e atendimento aos apontamentos de acessibilidade vindos do Marketplace Aurora. |

### Próximos passos sugeridos
1. Monitorizar métricas de adopção dos bundles (`bundle_view`, `bundle_launch`) na variante localizada e comparar com a rota em inglês.
2. Agendar revisão trimestral de acessibilidade para validar se os componentes partilhados permanecem conformes após evoluções do design system.
3. Partilhar as evidências de testes com a equipa de suporte para atualizar playbooks de contingência focados em agentes.
