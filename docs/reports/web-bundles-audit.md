# Auditoria Web Bundles & Experiência Web

## 1. Inventário de bundles ativos

### Catálogo principal
- **Agentes web (10 bundles)**: `analyst`, `architect`, `bmad-master`, `bmad-orchestrator`, `dev`, `pm`, `po`, `qa`, `sm`, `ux-expert`. 【F:web-bundles/agents/analyst.txt†L1-L40】【f78ea5†L1-L15】
- **Equipes pré-configuradas (4 bundles)**: `team-all`, `team-fullstack`, `team-ide-minimal`, `team-no-ui`. 【f78ea5†L1-L15】【F:web-bundles/teams/team-all.txt†L1-L40】

### Pacotes de expansão
- **bmad-2d-phaser-game-dev**: agentes `game-designer`, `game-developer`, `game-sm` e equipa `phaser-2d-nodejs-game-team`. 【39f873†L1-L3】【fcfc67†L1-L4】【dcbd91†L1-L2】
- **bmad-creative-writing**: dez agentes editoriais (ex.: `plot-architect`, `cover-designer`) e equipa `agent-team`. 【9fc747†L1-L3】【d79b47†L1-L10】【0757ca†L1-L2】
- **bmad-infrastructure-devops**: agente único `infra-devops-platform`. 【800e5d†L1-L3】【9156d0†L1-L2】

### Observações sobre priorização por uso
- O backend expõe apenas atributos estáticos (slug, competências, disponibilidade) para os agentes; não há métricas de utilização nem contadores de chamadas por bundle. 【F:backend/services/core/domain/agents.py†L41-L188】
- O frontend também não regista eventos específicos por bundle além dos contadores genéricos de página (`bmad_web_page_view_total`), impossibilitando priorização baseada em dados reais. 【F:frontend/telemetry/init.ts†L1-L73】
- Recomendação imediata: instrumentar telemetria de seleção/ativação de bundles e armazenar agregados (ex.: `bundle_usage_total`, `bundle_last_used_at`) para suportar priorizações futuras.

## 2. Estado de lint e testes
- `npm run lint` aborta porque `next lint` deteta ausência de configuração e abre prompt interativo; é necessário comitar um `.eslintrc` alinhado ao código ou parametrizar a execução CI. 【deb5ac†L1-L9】【93f049†L1-L4】【4b50f2†L1-L7】
- `npm run test` falha porque o script não existe na raiz do monorepo; apenas `test:web:*` está definido. 【1de789†L1-L7】【F:package.json†L1-L16】

## 3. Revisão UI/UX e acessibilidade

### Padrões gerais
- Layout global inclui skip-link e zonas responsivas (`AppChrome`, `MainNav`, `ResponsiveGrid`), mas faltam indicadores de foco consistentes em botões secundários e mensagens contextuais com semântica ARIA. 【F:frontend/app/layout.tsx†L1-L30】【F:frontend/components/layout/AppChrome.tsx†L10-L93】【F:frontend/components/navigation/MainNav.tsx†L6-L82】【F:frontend/components/layout/ResponsiveGrid.tsx†L1-L24】

### Contraste e legibilidade
- Variantes `success` e `critical` de `StatusBadge` usam texto colorido (#2EC4B6, #EF6351) sobre fundos pálidos com contraste < 3:1, abaixo do mínimo de 4.5:1 para texto normal. 【F:frontend/components/ui/StatusBadge.tsx†L5-L36】【e6e134†L1-L25】【2749cc†L1-L4】
- Cards destacados utilizam borda lateral colorida sem alternativa textual, reduzindo distinção para utilizadores com daltonismo; combinar cor + ícone/label adicional mitigaria o problema. 【F:frontend/components/ui/Card.tsx†L11-L53】

### Estados de erro e feedback
- `AgentsPage` e `DashboardPage` exibem erros dentro de `<Card>` sem `role="alert"` ou foco automático, dificultando leitura por leitores de ecrã. 【F:frontend/app/agents/page.tsx†L53-L85】【F:frontend/app/page.tsx†L138-L239】【F:frontend/app/page.tsx†L411-L433】
- Falta confirmação visual clara ao limpar filtros; o botão reutiliza `retry-button` sem feedback de estado desabilitado. 【F:frontend/app/agents/page.tsx†L67-L155】

### Fluxos específicos
- `AgentsFilters` permite multi-seleção mas não oferece resumo do filtro ativo nem atalho para limpar tudo; adicionar contadores ou `aria-live` ajudaria. 【F:frontend/components/agents/AgentsFilters.tsx†L28-L136】
- O banner offline alterna cores com alto brilho; apesar de `aria-live="polite"`, recomenda-se adicionar ícone com `aria-label` e gradiente com contraste suficiente. 【F:frontend/components/offline/OfflineBanner.tsx†L6-L48】

## 4. Próximos passos sugeridos
1. Instrumentar telemetria de uso por bundle (eventos em UI + API) e construir painel de priorização.
2. Corrigir pipeline de lint/testes (configuração ESLint compartilhada e script `npm run test` apontando para workspaces).
3. Ajustar tokens de cor/acessibilidade (novas cores contrastantes, roles ARIA para mensagens de erro, affordances extras nos cards e filtros).

### Issues abertas
- [`docs/issues/web-bundles-usage-telemetry.md`](../issues/web-bundles-usage-telemetry.md) — especifica métricas e dashboards necessários.
- [`docs/issues/ui-accessibility-status-badges.md`](../issues/ui-accessibility-status-badges.md) — trata contraste das badges e bordas de cards.
- [`docs/issues/agents-page-feedback-a11y.md`](../issues/agents-page-feedback-a11y.md) — aborda mensagens de erro, limpeza de filtros e melhorias ARIA.
