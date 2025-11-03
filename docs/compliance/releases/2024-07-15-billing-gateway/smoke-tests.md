# Smoke Tests – Billing Gateway (15/07/2024)

- Ambiente: Sandbox (InMemory driver)
- Suite executada: `pytest tests/e2e/payments -m "e2e and payments"`
- Resultado: ✅ Todos os cenários aprovados

| Cenário | Status | Evidência |
| --- | --- | --- |
| Tokenização + pré-autorização + captura + estorno | ✅ | Registro no artefato `payments-e2e` gerado pela pipeline. |
| Cartão inválido retorna `declined` | ✅ | Response HTTP 200 com motivo `invalid_card`. |
| Falha de gateway retorna `502` | ✅ | Response HTTP 502 com mensagem mascarada. |

Logs exportados automaticamente para `artifacts/payments-e2e/` via workflow [`payments.yml`](../../../.github/workflows/payments.yml).
