# Contratos de Integração Pact

Os contratos desta release validam fluxos críticos entre o marketplace interno e consumidores que utilizam o catálogo público de integrações. A geração dos pacts acontece durante a suíte `pytest` dedicada em `tests/contracts`, com os artefatos publicados para análise nas pipelines automatizadas de contrato (`.github/workflows/contracts.yml`).

## Cobertura atual

| Serviço fornecedor | Consumidor | Endpoint | Objetivo | Evidência |
| --- | --- | --- | --- | --- |
| Core Marketplace (`core-marketplace`) | Web App (`bmad-web`) | `GET /marketplace/apps` | Garantir catálogo completo e ordem estável para filtros client-side. | `tests/contracts/test_marketplace_contracts.py::marketplace_pact` |
| Core Marketplace (`core-marketplace`) | Web App (`bmad-web`) | `GET /marketplace/apps/{partnerId}/contract` | Validar escopos, limites e webhooks publicados para instalação de parceiros. | `tests/contracts/test_marketplace_contracts.py::marketplace_pact` |
| Core Marketplace (`core-marketplace`) | Web App (`bmad-web`) | `POST /marketplace/apps/{partnerId}/install` | Emitir sandbox e credenciais efêmeras quando solicitado pelo hub. | `tests/contracts/test_marketplace_contracts.py::marketplace_pact` |

## Execução automatizada

- `./scripts/test-contracts.sh` gera os arquivos Pact e sincroniza os artefatos para `artifacts/contracts`. Os testes do provedor garantem que as respostas FastAPI permanecem aderentes aos contratos gerados (`test_marketplace_provider_matches_contract`).
- A verificação roda de forma independente via workflow `Contract Testing`, acionado por `push`/`pull_request` que toquem serviços ou contratos. Os pacts publicados ficam disponíveis no artefato `pact-contracts` da execução.

## Próximos passos sugeridos

1. Expandir cobertura para fluxos autenticados (ex.: `/auth/login`) usando estados de provedor dedicados e fixtures de banco em memória.
2. Publicar os pacts em broker compartilhado para permitir verificação cruzada com times externos.
3. Adicionar testes de contrato para webhooks críticos (pagamentos e housekeeping) antes do go-live.
