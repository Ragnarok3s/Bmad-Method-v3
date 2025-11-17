# Stack recomendado para o MVP de reservas e propriedades

## Objetivo

Consolidar um stack de implementação rápido para o MVP, equilibrando velocidade de entrega com bases sólidas de observabilidade e escalabilidade mínima. As escolhas abaixo priorizam linguagem única quando possível, automação de documentação e facilidade de deploy em cloud acessível.

## Front-end (Next.js/React)
- **Framework**: Next.js 14 com React e TypeScript para renderização híbrida (SSR/SSG) e roteamento orientado a app router.
- **Estilo**: HTML semântico com CSS Modules ou styled-jsx para isolamento; design tokens garantem consistência visual.
- **Dados**: `fetch` com cache incremental; fallback offline limitado via IndexedDB se necessário.
- **Hospedagem**: Vercel ou Hostinger com suporte a Next.js; CDN integrada para ativos estáticos.

## Back-end (API REST)
- **Opção A — Node.js + Express**: mantém a mesma linguagem do front, acelera colaboração full stack e permite criar endpoints dentro do próprio monorepo (Next.js API routes ou app separado). Ideal para squads pequenas que querem unificar TypeScript.
- **Opção B — Python + FastAPI**: documentação automática via OpenAPI/Swagger, validação forte com Pydantic e excelente performance em async. Boa escolha quando a equipe prefere Python ou já possui libs de domínio.
- **Requisitos comuns**: Autenticação delegada (gateway/IdP), middlewares de logging estruturado e tracing OpenTelemetry para métricas e logs desde o início.

## Banco de dados e acesso
- **Banco relacional**: PostgreSQL recomendado; MySQL aceitável para requisitos simples. Ambos podem ser provisionados via Docker Compose local e serviços gerenciados em nuvem (Heroku, Railway, Supabase).
- **ORM**: Prisma (Node) ou SQLAlchemy 2.0 (Python) para schemas versionados e migrações automatizadas.
- **Práticas**: Variáveis de ambiente para credenciais, migrações executadas em CI/CD antes de subir novas versões e seeds mínimas para ambientes de demo.

## Deploy e operações
- **Contêineres**: Build de imagens Node ou Python publicadas em registry; docker-compose para desenvolvimento local.
- **Infra de baixo custo**: Hostinger/VPS para app monolítico; Railway/Render para API + banco gerenciado; Vercel para front-end desacoplado.
- **Observabilidade**: Coletor OTLP (Tempo/Prometheus/Loki ou OpenTelemetry Collector) com dashboards Grafana prontos para HTTP, banco relacional e tempos de resposta do front.

## Tarefas para uso 100% web e alinhamento ao stack
1. **Fixar a linguagem principal** (TypeScript/Node ou Python) e atualizar ADR/decisões técnicas para refletir a escolha.
2. **Unificar clientes** em interface web: descontinuar builds mobile nativas, remover feature flags de apps legadas e redirecionar usuários para a URL pública.
3. **Criar app Next.js** (ou ajustar o existente) com rotas para reservas, propriedades, autenticação e painel do anfitrião; incluir layout responsivo e testes de smoke via Playwright.
4. **Expose API REST** com Express (ou FastAPI) separando camadas: `routes`/`controllers`, `services`, `repositories`; gerar documentação OpenAPI e publicar em `/docs`.
5. **Provisionar PostgreSQL** gerenciado para produção e staging; configurar parâmetros (`DATABASE_URL`, pool) e automatizar migrações (Prisma ou Alembic/SQLAlchemy) no CI/CD.
6. **Integrar autenticação web** via IdP (OAuth/OIDC) e session storage seguro (cookies httpOnly); aplicar RBAC mínimo para anfitriões e administradores.
7. **Configurar deploy web**: Vercel para front, Railway/Render/Hostinger para API; pipelines de build/test/deploy versionadas com revisão obrigatória.
8. **Observabilidade e segurança**: ativar tracing/logs estruturados (OTel), métricas de latência/erros, limites de rate limiting no gateway e backups automáticos do banco.
9. **Desativar modos offline** e sincronizações locais: remover IndexedDB opcional e dependências PWA; garantir que todas as operações dependam da API online.
10. **Teste ponta a ponta** de fluxo web (reserva, cancelamento, gestão de propriedade) em staging com dados de seed e alertas configurados.

## Próximos passos
1. Escolher linguagem principal (TypeScript ou Python) e fixar a opção A ou B acima.
2. Configurar repositório com templates de CI para lint/test/build e migrações do banco.
3. Publicar versão demo em ambiente gerenciado (ex.: Vercel + Railway) para validar fluxos básicos de reservas.
