# SDK Node.js do Marketplace

O pacote `@bmad/marketplace-sdk` acelera a integração com os contratos públicos, auditoria e billing
para parceiros.

## Instalação

```bash
npm install @bmad/marketplace-sdk
```

## Uso básico

```ts
import { MarketplaceClient } from '@bmad/marketplace-sdk';

const client = new MarketplaceClient({
  baseUrl: 'https://core.bmad.example/marketplace',
  token: process.env.BMAD_PARTNER_TOKEN
});

const apps = await client.listApps({ categories: ['Revenue'] });
const contract = await client.getContract('smart-pricing');

await client.requestInstall('smart-pricing', {
  workspaceId: 'ws_123',
  scopes: ['bookings', 'analytics'],
  grantedBy: 'ana.santos@hotelaria.example'
});
```

## Webhooks de faturamento

```ts
import { createBillingWebhookHandler } from '@bmad/marketplace-sdk/webhooks';

export const handler = createBillingWebhookHandler({
  secret: process.env.BMAD_WEBHOOK_SECRET,
  onUsageRecorded: (event) => {
    console.log('usage', event.payload);
  }
});
```

Consulte os [exemplos](./examples.md) para fluxos completos.
