# Exemplos de ponta a ponta

## 1. Provisionar sandbox e instalar app

1. Liste apps e encontre o `sandboxOnly`.
2. Solicite instalação com `sandboxRequested: true`.
3. Receba credenciais e use-as com o endpoint `/payments/sandbox` (exemplo fictício).

```bash
curl -X POST \
  https://core.bmad.example/marketplace/apps/payments-360/install \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{
    "workspaceId": "ws_123",
    "scopes": ["payments", "analytics"],
    "grantedBy": "joao@bmad.example",
    "sandboxRequested": true
  }'
```

## 2. Consultar trilha de auditoria

```bash
curl https://core.bmad.example/marketplace/apps/smart-pricing/audit \
  -H 'Authorization: Bearer <token>'
```

Retorno:

```json
[
  {
    "timestamp": "2024-06-01T12:03:00Z",
    "action": "install.requested",
    "actor": "joao@bmad.example",
    "metadata": {
      "scopes": "bookings,analytics",
      "sandbox": "true"
    }
  }
]
```

## 3. Webhook de faturamento

```json
{
  "event": "billing.usage.recorded",
  "partner_id": "smart-pricing",
  "payload": {
    "metric": "reservation_synced",
    "quantity": "12",
    "amount": "36.00"
  }
}
```

Tratamento sugerido:

```ts
billingService.record_usage('smart-pricing', {
  metric: 'reservation_synced',
  quantity: new Decimal('12'),
  unit_price: new Decimal('3')
});
```
