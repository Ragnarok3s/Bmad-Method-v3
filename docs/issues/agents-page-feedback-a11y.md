# Issue: Feedback insuficiente e acessibilidade limitada na página de agentes

## Estado
✅ Resolvido em 2025-03-04. A rota `/agentes` foi alinhada ao catálogo dinâmico partilhado com `/agents`, com foco automático em alertas, botões reutilizáveis e testes de acessibilidade documentados.

## Resumo da solução
- A página passa a reutilizar `AgentsCatalogView`, garantindo `role="alert"`, `aria-live` e foco programático para erro, vazio e paginação.【F:apps/web/components/agents/AgentsCatalogView.tsx†L42-L209】【F:apps/web/app/agentes/page.tsx†L1-L36】
- O botão extraído `AgentActionButton` aplica estados `loading/disabled`, foco visível e variantes consistentes para ações de retry, limpeza e lançamento de bundles.【F:apps/web/components/agents/AgentActionButton.tsx†L1-L63】【F:apps/web/components/agents/AgentsCatalogView.tsx†L150-L209】
- Testes RTL + `jest-axe` confirmam foco automático e anúncios `aria-live` para erro, vazio e paginação na rota localizada.【F:apps/web/app/agentes/__tests__/AgentesPage.test.tsx†L1-L115】

## Evidências
- Execução da suíte de testes `apps/web/app/agentes/__tests__/AgentesPage.test.tsx` e `apps/web/app/agents/__tests__/AgentsPage.test.tsx` (regressão cruzada) sem violações de acessibilidade.【F:apps/web/app/agentes/__tests__/AgentesPage.test.tsx†L1-L115】【F:apps/web/app/agents/__tests__/AgentsPage.test.tsx†L1-L120】
- Instrumentação dos eventos `bundle_view` e `bundle_launch` com atributos `bundle_id`, `bundle_type`, `workspace` e `context` replicados via `useAnalytics` e OTel.【F:apps/web/components/agents/AgentsCatalogView.tsx†L70-L107】

## Follow-up
- Monitorizar métricas `bundle_view` e `bundle_launch` na variante localizada durante o trimestre Q3 2025 e reportar anomalias na revisão mensal do roadmap.【F:docs/product/backlog.md†L101-L108】
