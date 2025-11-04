# Backlog de Produto — Página de Agentes

## Auditoria de 2025-02-17

### Escopo
- Itens avaliados: épico `BL-02 Configuração de Agentes` do roadmap e issue "Feedback insuficiente e acessibilidade limitada na página de agentes".
- Implementação verificada: rota `/agentes` do front-end web (`apps/web/app/agentes/page.tsx`).

### Resumo da verificação
- O épico `BL-02` continua **não atendido** na variante em português da aplicação. Os critérios de aceite exigem catálogo com filtros dinâmicos, tags e pré-configuração acionável, o que não está presente na rota atual.【F:docs/product-roadmap.md†L17-L27】【F:apps/web/app/agentes/page.tsx†L1-L58】
- A issue de acessibilidade permanece **aberta** porque os melhoramentos descritos só foram implementados na rota `/agents` em inglês. A rota `/agentes` não possui filtros acessíveis, estados anunciáveis nem tratamento de erro compatível.【F:docs/issues/agents-page-feedback-a11y.md†L1-L15】【F:apps/web/app/agentes/page.tsx†L1-L58】

### Detalhes da lacuna `BL-02`
- **Catálogo dinâmico**: a página em português renderiza uma lista estática sem integração com `useAgentsCatalog`, impedindo filtros e paginação reais.【F:apps/web/app/agentes/page.tsx†L8-L49】
- **Tags e resumo de filtros**: não há componente equivalente a `AgentsFilters`, impossibilitando o anúncio de filtros ativos e atualização em tempo real para leitores de ecrã.【F:apps/web/app/agentes/page.tsx†L33-L47】
- **Pré-configuração acionável**: o botão "Lançar bundle" e telemetria associados à seleção de agentes não existem nesta variante, contrariando o requisito de gerar pré-configuração e métricas de adoção.【F:docs/product-roadmap.md†L17-L27】【F:apps/web/app/agentes/page.tsx†L33-L58】

### Issues relacionadas
| Issue | Situação | Evidência |
|-------|----------|-----------|
| `docs/issues/agents-page-feedback-a11y.md` | Continua aberta; rota `/agentes` não implementa alertas acessíveis, nem resumo de filtros. | 【F:docs/issues/agents-page-feedback-a11y.md†L1-L15】【F:apps/web/app/agentes/page.tsx†L33-L58】 |

## Plano de ação atualizado

| ID | Descrição | Critérios de aceite atualizados | Dependências | Status |
|----|-----------|---------------------------------|--------------|--------|
| BL-02-T1 | Unificar `/agentes` com o catálogo dinâmico (`useAgentsCatalog`, `AgentsFilters`, paginação, telemetria de bundles) garantindo paridade funcional com `/agents`. | (a) Catálogo em português consulta a API e aplica filtros/paginação dinâmicos; (b) resumo `aria-live` anuncia filtros ativos; (c) botão de pré-configuração dispara métrica e retorna objeto pronto para provisionamento. | API de agentes disponível; componentes compartilhados existentes (`AgentsFilters`, `StatusBadge`, `ResponsiveGrid`). | Aberto |
| BL-02-T2 | Adicionar suíte de testes e verificações de acessibilidade para `/agentes`, espelhando cenários validados em `/agents`. | (a) Testes RTL + `axe` cobrindo estados de erro, vazio e paginação; (b) foco automático em alertas; (c) cobertura no pipeline CI. | Dependência de `jest-axe` e utilitários já usados na rota inglesa. | Aberto |
| BL-02-T3 | Extrair o botão de ação (`retry/launch`) para componente reutilizável com estados `loading` e `disabled`, aplicando estilos consistentes e foco visível. | (a) Componente dedicado aceita `variant`, `isLoading`, `onClick`; (b) documentar tokens de foco; (c) rota `/agentes` atualiza para usar o novo componente. | Design system e tokens existentes. | Aberto |

## Priorização pós-lançamento de curto prazo

| Ordem | Item | Justificativa | Aprendizado esperado |
|-------|------|---------------|----------------------|
| 1 | BL-02-T1 | Resolverá principais bloqueios identificados com clientes piloto sobre filtros e telemetria, permitindo medir adoção real após checkpoints de 19/07 e 22/07. | Validar se catálogo dinâmico suporta cenários de alto volume reportados por Fintech Álamo e Banco Solaris. |
| 2 | BL-02-T3 | Melhorar experiência dos callbacks e ações rápidas antes do teste de contingência em 29/07. | Observar impacto no tempo médio de resposta e clareza de ações durante simulado com Coop CredMais. |
| 3 | BL-02-T2 | Garantir sustentabilidade após estabilização das primeiras métricas e antes da revisão de 02/08. | Confirmar redução de regressões e atendimento aos apontamentos de acessibilidade vindos do Marketplace Aurora. |

### Próximos passos sugeridos
1. Priorizar BL-02-T1 na próxima sprint para recuperar alinhamento com o roadmap MVP.
2. Agendar sessão de QA focada em acessibilidade após implementar BL-02-T1/T2.
3. Atualizar a issue de acessibilidade com evidências (prints e logs de testes) assim que os critérios forem cumpridos.
