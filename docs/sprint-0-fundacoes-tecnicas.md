# Sprint 0 – Plano de Fundações Técnicas

## Objetivo
Configurar a base tecnológica necessária para acelerar o desenvolvimento contínuo das funcionalidades do MVP, garantindo ambientes consistentes, pipelines automatizados, observabilidade inicial e governança operacional.

## Guiding Principles
- **Primeiro a confiabilidade:** ambientes reproduzíveis (dev/staging) com verificações automatizadas antes de liberar acesso às squads.
- **Automação por padrão:** pipelines CI/CD prontos desde o primeiro commit, executando `scripts/test-unit.sh` e `scripts/test-integration.sh`.
- **Segurança e conformidade antecipadas:** controles de acesso, secrets management e logging alinhados às exigências de privacidade (LGPD/GDPR) definidas em `docs/testing-strategy.md` e `docs/plano-kickoff-mvp.md`.
- **Observabilidade mínima viável:** métricas, logs e alertas básicos publicados conforme `docs/observability-stack.md`.

## Backlog Priorizado por Trilha

### 1. Controle de Código e Branching
| História | Descrição | Critérios de Aceitação | Owner | Dependências |
| --- | --- | --- | --- | --- |
| S0-GIT-01 | Configurar repositórios mono-repo/backend/frontend com políticas de proteção de branch | Branch principal com proteção (review obrigatório, status checks para testes), template de PR publicado em `docs/engineering-handbook.md` | DevOps Lead | Acesso GitHub/CI |
| S0-GIT-02 | Publicar convenções de branching e naming | Documento atualizado em `docs/engineering-handbook.md` (seção Fluxo de Git) e comunicado no kick-off | Engineering Lead | S0-GIT-01 |

### 2. Pipelines CI/CD
| História | Descrição | Critérios de Aceitação | Owner | Dependências |
| --- | --- | --- | --- | --- |
| S0-CI-01 | Provisionar pipeline CI executando suites unitárias e lint | Pipelines rodando em cada PR, armazenamento de logs no provedor CI, integração com status check | DevOps Engineer | S0-GIT-01 |
| S0-CD-01 | Configurar entrega contínua para ambiente de staging | Deploy automatizado em branch principal com gate manual, rollback documentado em `docs/engineering-handbook.md` | Platform Engineer | S0-CI-01 |
| S0-CI-02 | Implementar caching de dependências | Execuções subsequentes com redução ≥30% no tempo de build medido e reportado em ata semanal | DevOps Engineer | S0-CI-01 |

### 3. Ambientes e Infraestrutura
| História | Descrição | Critérios de Aceitação | Owner | Dependências |
| --- | --- | --- | --- | --- |
| S0-INF-01 | Provisionar ambiente de desenvolvimento containerizado | Docker Compose/Kubernetes manifestos validados, manual rápido em `docs/engineering-handbook.md` | Platform Engineer | Plano de infra aprovado |
| S0-INF-02 | Configurar ambiente de staging com dados sintéticos | Base de dados populada com fixtures, scripts de reset automatizados, credenciais geridas via vault | Infra Lead | S0-INF-01 |
| S0-INF-03 | Estabelecer processo de gestão de secrets | Vault/Secret Manager configurado, rotação documentada, acesso auditável | Security Engineer | S0-INF-02 |

### 4. Observabilidade e Qualidade
| História | Descrição | Critérios de Aceitação | Owner | Dependências |
| --- | --- | --- | --- | --- |
| S0-OBS-01 | Implementar coleta de métricas básicas (latência, throughput, erros) | Dashboard inicial publicado conforme template em `docs/observability-stack.md` | Observability Lead | S0-INF-01 |
| S0-LOG-01 | Centralizar logs de aplicações e infraestrutura | Stack de logging com retenção mínima de 14 dias, acesso RBAC documentado | DevOps Engineer | S0-INF-01 |
| S0-QA-01 | Definir suite de smoke tests automatizados | Scripts adicionados em `scripts/smoke-tests/` com execução documentada e thresholds mínimos | QA Lead | S0-INF-01, S0-CI-01 |

### 5. Governança e Rituais
| História | Descrição | Critérios de Aceitação | Owner | Dependências |
| --- | --- | --- | --- | --- |
| S0-GOV-01 | Publicar calendário e atas de rituais técnicos | Calendário em canal oficial, atas no diretório `docs/atas/` com convenção padrão | Scrum Master | Kick-off concluído |
| S0-GOV-02 | Formalizar matriz RACI para fundações técnicas | Tabela atualizada em `docs/playbook-operacional.md` e comunicada no steering semanal | Operations Manager | S0-GOV-01 |

## Sequência Recomendada (Timeline de 10 dias úteis)
1. **Dia 1-2:** Finalizar acordos de acesso, provisionar repositórios e políticas de branch (S0-GIT-01/02).
2. **Dia 2-4:** Configurar pipeline CI inicial e caching (S0-CI-01/02).
3. **Dia 3-6:** Provisionar ambiente dev/staging e gestão de secrets (S0-INF-01/02/03).
4. **Dia 5-7:** Automatizar CD para staging com rollback documentado (S0-CD-01).
5. **Dia 6-8:** Implementar observabilidade base (S0-OBS-01, S0-LOG-01).
6. **Dia 7-9:** Criar suite de smoke tests e integrá-la nos pipelines (S0-QA-01).
7. **Dia 8-10:** Fechar governança (S0-GOV-01/02) e atualizar documentação de apoio.

## Checklists de Readiness
- **Infraestrutura:**
  - [x] Ambientes dev/staging disponíveis e testados (scripts `scripts/infra/provision-dev.sh` e `scripts/infra/reset-staging.sh`).
  - [x] Scripts de provisionamento versionados em `scripts/infra/` (criar diretório se necessário).
  - [x] Secrets armazenados com rotação configurada (ver `docs/runbooks/gestao-de-secrets.md`).
- **CI/CD:**
  - [x] Execução automática de `scripts/test-unit.sh` em cada PR (`.github/workflows/ci.yml`).
  - [x] Execução automática de `scripts/test-integration.sh` no merge para branch principal (`CI` + `CD Staging`).
  - [x] Pipeline de deploy para staging com etapa manual e rollback (workflow `CD Staging` + runbook `docs/runbooks/rollback-staging.md`).
- **Observabilidade:**
  - [x] Dashboard inicial com métricas chave publicado (`grafana/staging/bmad-agents-001.json`).
  - [x] Logs centralizados com retenção de 14 dias (stack Loki + Promtail documentada).
  - [x] Alertas básicos (erro crítico, falha de deploy) configurados (`grafana/alerts/staging.yaml`).
  - [x] Quality gates coletam evidências (`scripts/run-quality-gates.sh` → `artifacts/observability/manifest.json`).
- **Governança:**
  - [x] Atas e calendário publicados (`docs/atas/calendario-rituais.md`).
  - [x] Matriz RACI atualizada (`docs/playbook-operacional.md`).
  - [x] Canal de incidentes configurado e comunicado (ver seção "Comunicação de Incidentes").

## Dependências Externas e Riscos
| Risco | Impacto | Mitigação | Indicador de Monitorização |
| --- | --- | --- | --- |
| Acesso atrasado ao provedor CI | Slippage na ativação do pipeline | Escalonar para operações 48h antes; alternativa local temporária | Status semanal no steering |
| Falta de dados sintéticos conformes | Bloqueio em testes de integração | Coordenar com Data Privacy para gerar dataset; checklist LGPD em `docs/testing-strategy.md` | Checklist de conformidade atualizado |
| Ferramenta de observabilidade não provisionada | Falta de visibilidade em staging | Provisionamento paralelo via equipe de infraestrutura; plano B com stack open source | Dashboard publicado até Dia 8 |

## Artefatos a Atualizar
- `docs/engineering-handbook.md` – fluxos de Git, pipelines e rollback.
- `docs/playbook-operacional.md` – governança, matriz RACI e canais.
- `docs/observability-stack.md` – dashboards e alertas ativos.
- `docs/metricas-kpis-dashboard.md` – indicadores de readiness do Sprint 0.
- `docs/atas/` – atas de planning, daily e checkpoints.

## Definition of Done da Sprint 0
1. Ambientes dev/staging operacionalizados com smoke tests verdes.
2. Pipelines CI/CD com execuções bem-sucedidas e cobertura mínima reportada no dashboard.
3. Observabilidade mínima viável ativa e documentada.
4. Governança e comunicação com rituais em funcionamento e evidências arquivadas.
5. Documentação atualizada refletindo processos, owners e resultados.

## Próximos Passos Pós-Sprint 0
- Revisar métricas de ciclo (lead time de build, taxa de sucesso de pipelines) na retrospectiva.
- Priorizar débito técnico e gaps identificados para Sprint 1.
- Atualizar checkpoints Go/No-Go com evidências consolidadas.
- Preparar backlog funcional para reservas/calendário conforme `docs/product-roadmap.md`.
