# BMAD Web App — Auditoria Visual e Técnicas (30/10/2024)

## Contexto
- Ambiente local Next.js (`npm run dev`) com API core indisponível.
- Auditoria feita em viewport 1280×720 e idioma padrão.
- Captura de ecrã principal disponível em `browser:/invocations/shcdknyx/artifacts/artifacts/app-home.png`.
- Comandos executados: `npm run dev`, `npm test`, `npm run lint`.

## Principais defeitos visuais encontrados

### 1. Cards críticos do dashboard em estado de erro permanente
- Todas as métricas chave exibem "Ocorreu um erro inesperado ao carregar as métricas do dashboard." sempre que a Core API não responde, deixando o painel inutilizável.【F:apps/web/app/page.tsx†L138-L199】【F:apps/web/services/api/dashboard.ts†L1-L69】
- O mesmo padrão ocorre para SLAs dos parceiros, com mensagens genéricas e nenhum dado de fallback.【F:apps/web/app/page.tsx†L365-L408】【F:apps/web/services/api/partners.ts†L1-L80】
- Impacto: a primeira impressão do utilizador é um painel recheado de mensagens de erro em vermelho, sem indicar passos de mitigação claros além de "contacte o time".
- Recomendação: providenciar dados simulados quando a Core API estiver offline, ou apresentar estado vazio/placeholder com call-to-action (ex.: "Configure a ligação à API"). Também diferenciar visualmente erros temporários vs. configuração inicial.

### 2. Indicador flutuante de erro permanente
- Surge um "1 error" em pill vermelha sobre o menu lateral mesmo após fechar o DevTools overlay. Esse elemento não possui contexto nem permite interação.
- Sem registro explícito em código-fonte, mas é resultado de um erro silencioso de telemetria/fetch que dispara o overlay de erros do Next em modo desenvolvimento.
- Recomendação: tratar exceções de telemetria (ver ponto 3) e capturar erros de rede para evitar overlays genéricos.

### 3. Fontes Inter corrompidas nos assets gerados
- Ficheiros `.woff2` gerados têm 16 bytes, provocando warnings "Failed to decode downloaded font" e regressão visual para fontes de sistema.【F:apps/web/app/layout.tsx†L1-L26】【bd6a05†L1-L4】
- Causa provável: build inicial sem acesso à CDN do Google Fonts. Enquanto o ficheiro estiver truncado, qualquer build reutiliza a versão defeituosa.
- Recomendação: remover `.next/static/media/*woff2` do controlo de versão e garantir `next/font` reconstrói assets válidos (ex.: executar `next dev` com rede ou incluir fallback local com `display: swap`).

### 4. Telemetria gera erros de rede em todas as sessões
- O `TelemetryProvider` inicializa exportadores OTLP apontando para `http://localhost:4318/v1/*` sem verificar disponibilidade.【F:apps/web/telemetry/init.ts†L1-L119】
- Em ambientes sem colector OTLP, o browser gera múltiplas requisições falhadas (e possivelmente o badge "1 error").
- Recomendação: tornar a telemetria opcional quando as variáveis `NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT` não estiverem definidas, e suprimir exportadores até existir colector.

### 5. Fluxo de tour guiado depende de storage local e pode quebrar hooks
- Lint aponta dependências instáveis em `usePageTour` e `TourContext`, o que pode causar re-renderizações infinitas ou estado inconsistente ao navegar.【098d19†L1-L17】【F:apps/web/components/tour/usePageTour.ts†L8-L36】【F:apps/web/components/tour/TourContext.tsx†L240-L296】
- Visualmente, isso manifesta-se como popup do tour reaparecendo mesmo após concluído.
- Recomendação: seguir sugestões do ESLint (`react-hooks/exhaustive-deps`) para estabilizar dependências.

### 6. Contexto de tenant com capacidades instáveis
- `TenantProvider` recria `resolvedCapabilities` fora de um `useMemo`, invalidando memoizações descendentes e podendo causar flicker de banners dependentes dessas flags.【098d19†L8-L16】【F:apps/web/lib/tenant-context.tsx†L63-L105】
- Recomendação: mover a criação de `resolvedCapabilities` para dentro do `useMemo` ou memorizá-lo separadamente.

## Testes executados
- `npm test -- --runTestsByPath ./app/__tests__/dashboard.test.tsx` falhou: não existe test suite correspondente, indicando lacuna de cobertura regressiva.【9a9d5f†L1-L19】
- `npm run lint` reportou avisos `react-hooks/exhaustive-deps` nas áreas mencionadas acima.【098d19†L1-L17】

## Próximos passos sugeridos
1. Preparar mocks estáticos para endpoints críticos ou usar MSW em modo desenvolvimento para evitar dashboards vazios.
2. Regerar fontes com `next/font` em ambiente conectado e adicionar verificação CI que falha quando `.woff2` inválidos são produzidos.
3. Guardar inicialização de telemetria com feature flag e log amigável quando o colector não estiver configurado.
4. Corrigir dependências dos hooks conforme avisos do ESLint e adicionar testes de regressão para tour e tenant contextos.
5. Incluir testes unitários mínimos para `app/page.tsx` e `TourContext` cobrindo estados de erro e completude do tour.

