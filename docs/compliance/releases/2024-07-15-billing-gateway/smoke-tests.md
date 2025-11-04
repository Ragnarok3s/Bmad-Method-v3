# Smoke Tests – Billing Gateway (15/07/2024)

- Ambiente: Production-candidate (infraestrutura idêntica à produção).
- Suite executada: `pytest tests/e2e/payments -m "e2e and payments" --env production_candidate`.
- Resultado: ✅ Todos os cenários aprovados (build `2024.07.15-prodready`).

| Cenário | Status | Evidência |
| --- | --- | --- |
| Tokenização + pré-autorização + captura + estorno | ✅ | Registro no artefato `payments-e2e` gerado pela pipeline (job `smoke-pc`). |
| Cartão inválido retorna `declined` | ✅ | Response HTTP 200 com motivo `invalid_card` (log `run-4587`). |
| Falha de gateway retorna `502` | ✅ | Response HTTP 502 com mensagem mascarada (screenshot `grafana/error-budget.png`). |
| Requisição duplicada respeita `idempotency_key` | ✅ | Logs Loki confirmam uma única autorização persistida. |

Logs exportados automaticamente para `artifacts/payments-e2e/` via workflow [`payments.yml`](../../../.github/workflows/payments.yml).
