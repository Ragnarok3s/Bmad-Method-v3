# Contratos – Billing Gateway API

Atualização de 15/07/2024 descrevendo os contratos consolidados do serviço de billing exposto via FastAPI.

## Endpoints Entregues

| Endpoint | Método | Descrição | Autenticação | Observações de PCI |
| --- | --- | --- | --- | --- |
| `/billing/tokenize` | `POST` | Recebe dados de cartão criptografados em trânsito e retorna token mascarado armazenado no cofre. | API Key interna (mTLS em produção) | CVV descartado após tokenização e PAN nunca persiste em logs. |
| `/billing/authorizations` | `POST` | Cria pré-autorização em gateway configurado. | API Key interna | Requer `idempotency_key` para fluxos de reprocessamento. |
| `/billing/captures` | `POST` | Captura uma pré-autorização aprovada. | API Key interna | Garante consistência via auditoria de idempotência. |
| `/billing/refunds` | `POST` | Gera estorno total ou parcial associado a uma captura. | API Key interna | Bloqueio contra estorno superior ao valor capturado. |
| `/billing/reconciliation` | `GET` | Consulta resumo diário de liquidações por gateway. | API Key interna | Usa data de corte para conciliação com ERP. |
| `/billing/webhooks/{gateway}` | `POST` | Processa eventos assíncronos assinados pelo gateway. | Assinatura HMAC | Validação de assinatura obrigatória; eventos não assinados são ignorados. |

## Modelos de Requisição

### Tokenização
```json
{
  "gateway": "sandbox",
  "customer_reference": "guest-001",
  "card": {
    "pan": "4111111111111111",
    "expiry_month": 12,
    "expiry_year": 2032,
    "cvv": "123",
    "holder_name": "Guest Test"
  }
}
```

### Pré-autorização
```json
{
  "gateway": "sandbox",
  "token_reference": "sandbox_tok_000001",
  "amount": "150.00",
  "currency": "BRL",
  "capture": true,
  "idempotency_key": "auth-guest-001"
}
```

## Modelos de Resposta

```json
{
  "authorization_id": "sandbox_auth_000001",
  "status": "approved",
  "amount": "150.00",
  "currency": "BRL",
  "capture_pending": true,
  "gateway_reference": "sandbox_tok_000001",
  "created_at": "2024-07-15T12:00:00Z",
  "metadata": {}
}
```

## Tratamento de Erros

- `404 Not Found` para gateways não configurados.
- `400 Bad Request` quando validações de negócio falham (ex.: estorno maior que captura).
- `502 Bad Gateway` encapsula falhas do provedor externo, preservando logs internos para auditoria.

## Checklist de Conformidade

- Logs mascaram PAN/CVV automaticamente.
- Hash de idempotência garante replay seguro.
- Webhooks exigem assinatura HMAC (`X-Gateway-Signature`).
- Fluxos de estorno exigem duplo controle operacional antes do deploy em produção.
