# Qualidade Não Funcional

Este relatório consolida os controles automatizados para contratos de integração, desempenho e acessibilidade executados nesta release.

## Contratos de Integração

- **Escopo**: marketplace público (`GET /marketplace/apps`, `GET /marketplace/apps/{id}/contract`, `POST /marketplace/apps/{id}/install`).
- **Geração**: `pytest` produz os pacts através de `tests/contracts/test_marketplace_contracts.py`, validando tanto o consumidor quanto o provedor local. Asserções adicionais garantem que respostas dinâmicas (credenciais de sandbox) mantenham o formato combinado.
- **SLA**: cada commit relevante deve manter 100% de aderência aos pacts publicados; falhas interrompem o workflow `Contract Testing`.
- **Artefatos**: `./scripts/test-contracts.sh` sincroniza os contratos em `artifacts/contracts` para revisão.

## Desempenho (k6)

- **Script**: `quality/performance/k6/critical-scenarios.js` cobre três jornadas prioritárias: navegação no catálogo, leitura de contratos e emissão de sandbox.
- **Parâmetros chave**:
  - `p(95) < 800ms` para duração total das requisições (`http_req_duration`).
  - Falhas globais (`http_req_failed`) abaixo de 2%.
  - Latência de sandbox (`marketplace_install_latency`) abaixo de 900ms no p95.
  - Eventos de telemetria rejeitados (`knowledge_base_telemetry_failures`) abaixo de 5%.
- **Automação**: o job `performance-tests` em `.github/workflows/deploy-staging.yml` executa o script após o rollout de staging usando `grafana/k6-action`, publicando o resumo em `quality/performance/k6/`.

## Acessibilidade (axe-core)

- **Cobertura**: auditoria em produção estática das páginas iniciais, catálogo de agentes e conhecimento via `@axe-core/cli`.
- **Execução**: `./scripts/quality/run-axe.sh` compila a aplicação Next.js, sobe um servidor efêmero e roda a CLI para cada URL alvo.
- **Saída**: relatório consolidado em `quality/reports/a11y/axe-audit.json`, anexado à pipeline de CI.
- **SLA**: zero violações bloqueantes; qualquer falha encerra o job “Run Accessibility Audit (axe-core)” dentro do workflow CI.

## Próximos Passos

1. Parametrizar credenciais sintéticas para permitir inclusão de fluxos autenticados no k6 e nos contratos Pact.
2. Adicionar páginas adicionais (portal do proprietário, dashboard) ao scan de acessibilidade conforme novas features forem liberadas.
3. Integrar coleta de métricas k6 ao Grafana Cloud para histórico longitudinal.
