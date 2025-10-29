# API pública de parceiros

Esta API expõe contratos de integrações, solicitações de instalação e auditoria para parceiros.
Os exemplos abaixo assumem base URL `https://core.bmad.example/marketplace`.

## Listar apps disponíveis

```http
GET /apps
Accept: application/json
```

Resposta:

```json
[
  {
    "id": "smart-pricing",
    "name": "Smart Pricing AI",
    "description": "Automated pricing updates using ML-driven demand forecasts.",
    "categories": ["Revenue", "Automation"],
    "contractVersion": "2024-05-01",
    "sandboxOnly": false
  }
]
```

## Obter contrato público

```http
GET /apps/{partnerId}/contract
Accept: application/json
```

Campos importantes:

- `scopes`: lista de escopos que podem ser solicitados na instalação.
- `rateLimitPerMinute`: política de throttling aplicada ao parceiro.
- `webhookEndpoints`: destinos obrigatórios para eventos core.

## Solicitar instalação

```http
POST /apps/{partnerId}/install
Content-Type: application/json

{
  "workspaceId": "ws_123",
  "scopes": ["bookings", "analytics"],
  "grantedBy": "ana.santos@hotelaria.example",
  "sandboxRequested": true,
  "correlationId": "req-001"
}
```

Resposta (`202 Accepted`):

```json
{
  "sandboxId": "sbx_Dh281ud",
  "expiresAt": "2024-07-01T10:00:00Z",
  "credentials": {
    "client_id": "...",
    "client_secret": "..."
  }
}
```

## Auditoria

```http
GET /apps/{partnerId}/audit
Accept: application/json
```

Retorna eventos ordenados cronologicamente com ator, ação e metadados adicionais.
