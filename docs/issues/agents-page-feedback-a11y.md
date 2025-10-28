# Issue: Feedback insuficiente e acessibilidade limitada na página de agentes

## Problema
A página `/agentes` apresenta mensagens de erro e vazios dentro de `Card` sem semântica apropriada (`role="alert"`, foco automático), o botão "Limpar filtros" reutiliza estilo de retry sem indicar estado de carregamento, e os filtros não expõem resumo das seleções ou atualização dinâmica para leitores de ecrã. 【F:apps/web/app/agents/page.tsx†L53-L155】【F:apps/web/components/agents/AgentsFilters.tsx†L28-L136】

## Impacto
- Utilizadores com leitores de ecrã não recebem feedback imediato quando ocorre erro ou quando os filtros são aplicados.
- Não há confirmação visual clara após limpar filtros, prejudicando UX.
- Dificulta conformidade com WCAG 2.1 (4.1.3 Status Messages, 3.2.2 On Input).

## Ações recomendadas
1. Adicionar `role="alert"` + `aria-live="assertive"` nos `Card` de erro/vazio e mover foco para o container ao disparar `refresh` ou `setPage`. 【F:apps/web/app/agents/page.tsx†L53-L138】
2. Incluir `aria-live="polite"` e resumo textual (ex.: "3 competências ativas") na barra de filtros; disponibilizar botão dedicado "Limpar tudo" desabilitado enquanto `loading === true`. 【F:apps/web/components/agents/AgentsFilters.tsx†L55-L134】
3. Refatorar `retry-button` para componente reutilizável com estados `loading`, `disabled` e foco visível consistente. 【F:apps/web/app/agents/page.tsx†L141-L205】
4. Cobrir comportamento com testes de acessibilidade (React Testing Library + `axe-core`) validando anúncios via `aria-live`.

## Referências / Mockups
- Padrão GOV.UK "Error summary" para foco automático.
- Componentes de filtros com contadores expandidos (Figma: `Hospitality Agent Catalog v2`).
