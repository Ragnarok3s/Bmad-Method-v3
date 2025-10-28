# Platform Architecture Decisions

## 1. Target Platforms
- **Primary**: Aplicação web responsiva (desktop, tablet, mobile) entregue com Next.js para acelerar iterações e centralizar atualizações.
- **Secundário**: APIs públicas e SDKs leves consumidos por parceiros e automações internas; wrappers móveis híbridos permanecem no backlog até validar tração da experiência web.
- **Racional**: A camada web permite validar fluxos operacionais rapidamente, enquanto as APIs garantem extensibilidade para integrações OTA e ferramentas internas sem duplicar lógica de domínio.

## 2. Core Technology Stack
### Frontend
- **Framework**: Next.js 14 (App Router) com React 18 e TypeScript, combinando Server Components para dados e componentes `use client` para dashboards interativos.
- **Gestão de estado**: Hooks dedicados e caches incrementais baseados em `fetch`; IndexedDB (`idb`) sustenta sincronização offline limitada e replay de analytics.
- **UI**: Design tokens próprios + styled-jsx nos componentes (`apps/web/components/ui`) garantem consistência visual sem dependência de frameworks utilitários.
- **Telemetria**: OpenTelemetry Web (`apps/web/telemetry`) exporta traces, métricas e logs via OTLP/HTTP para o Collector.

### Backend
- **Arquitetura**: Serviço único FastAPI em Python 3 com módulos organizados por domínio (`services/core`). REST é a interface principal; GraphQL opcional via Strawberry compartilha os mesmos modelos.
- **Persistência**: SQLAlchemy 2.0 + Pydantic 2 para schemas; inicialização automática das tabelas ocorre via `Database.create_all` em `services/core/database.py`.
- **Orquestração interna**: Serviços como `AutomationService` e `PartnerSLAService` encapsulam regras de negócio (execução de playbooks, reconciliação de SLAs) com instrumentação de métricas em `services/core/metrics.py`.
- **Observabilidade**: Exporters OTLP/gRPC configurados em `services/core/observability.py` para traces, métricas e logs, expostos via health-check `/health/otel`.

### Data & Storage
- **Base transacional**: PostgreSQL 15 (via Docker Compose/Kubernetes) com SQLite usado nos testes automatizados.
- **Filas/cache**: Redis opcional para cenários de fila de sincronização OTA (infraestrutura provisionada em `design/docker-compose.dev.yml`).
- **Configuração**: Variáveis de ambiente carregadas por Kubernetes Secrets ou `.env` locais; não há dependência direta de serviços gerenciados cloud na fase atual.

### Cloud & DevOps
- **Contêineres**: Imagens publicadas no GHCR; ambientes locais utilizam `design/docker-compose.dev.yml` e Kustomize overlays (`design/k8s`) para dev/staging.
- **Deploy**: GitHub Actions executa testes, quality gates e publica manifestos; GitOps com Argo CD sincroniza overlays versionados (referência em `docs/engineering-handbook.md`).
- **Observabilidade**: Stack LGTM (Loki, Grafana, Tempo, Prometheus) alimentada por OpenTelemetry Collector; scripts `scripts/run-quality-gates.sh` e `verify_observability_gates.py` validam dashboards/alertas versionados.

## 3. Integrações Externas
### Canais de distribuição (OTAs)
- Estrutura de catálogo e SLAs dos parceiros modelada em `services/core/domain/partners` e exposta via `PartnerSLAService`.
- Estratégia MVP: webhooks normalizados (`PartnerWebhookPayload`) persistem eventos e atualizam indicadores, permitindo expandir conectores específicos (Booking.com, Airbnb, etc.) sem alterar o core.

### Pagamentos e faturação
- Integração com gateways permanece em descoberta; fluxo atual delega captura a sistemas existentes e apenas reconcilia estados via APIs internas.
- Requisitos PSD2/PCI são tratados através de redirecionamento/outros provedores até que módulo dedicado seja priorizado.

### Automação operacional
- Execuções de playbooks usam `AutomationService` com telemetria estruturada para acionar orquestrações externas (n8n/Temporal) através de webhooks, mantendo a complexidade fora do serviço core.

## 4. Segurança e Compliance
- **Autenticação**: O serviço assume autenticação realizada a montante (gateway ou IdP corporativo). Contexto do agente chega pelo header `X-Actor-Id`, validado em `services/core/api/rest.py`.
- **Autorização**: Matriz RBAC gerida por `SecurityService`, com políticas versionadas (`RolePolicy`) e catálogo de permissões auditável.
- **Auditoria**: `AuditLog` persiste operações críticas, respeitando requisitos de rastreabilidade descritos em `docs/governanca/`.
- **Proteção de dados**: Dados pessoais de hóspedes são mascarados antes de sair do serviço (`quality/privacy`). Criptografia e TLS são providos pela camada de infraestrutura (Ingress + Secrets).
- **Secure SDLC**: Quality gates executam Bandit, verificações de observabilidade e cobertura de testes; Dependabot e análises adicionais estão registradas no backlog de SRE.

## 5. Alinhamento com Roadmap
- Expandir integrações OTA priorizando conectores com webhooks existentes; cada novo conector deve alimentar métricas `bmad_core_ota_sync_*` para garantir monitorização.
- Consolidar telemetria no Collector com destino único (Grafana LGTM) e automatizar validações via pipelines antes de releases.
- Evoluir autenticação federada (OIDC) e provisionar rotação automática de segredos quando migrar para ambientes cloud gerenciados.
- Planejar módulo de billing e automações financeiras após validar adoção dos fluxos de reservas/housekeeping.
