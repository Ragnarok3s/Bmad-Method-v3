import { createHmac } from 'node:crypto';

export type BillingWebhookEvent = {
  event: string;
  partner_id: string;
  payload: Record<string, unknown>;
  delivered_at?: string;
};

export type BillingWebhookHandlerOptions = {
  secret: string;
  onUsageRecorded?: (event: BillingWebhookEvent) => void | Promise<void>;
};

export type BillingWebhookHandler = (
  rawBody: string | Buffer,
  headers: Record<string, string | string[] | undefined>
) => Promise<BillingWebhookEvent>;

export function createBillingWebhookHandler(options: BillingWebhookHandlerOptions): BillingWebhookHandler {
  return async (rawBody, headers) => {
    const signature = getHeader(headers, 'x-bmad-signature') ?? getHeader(headers, 'x-signature');
    if (!signature) {
      throw new Error('Missing webhook signature');
    }
    const bodyBuffer = typeof rawBody === 'string' ? Buffer.from(rawBody) : rawBody;
    const expected = createHmac('sha256', options.secret).update(bodyBuffer).digest('hex');
    if (expected !== signature) {
      throw new Error('Invalid webhook signature');
    }
    const event = JSON.parse(bodyBuffer.toString('utf-8')) as BillingWebhookEvent;
    if (event.event === 'billing.usage.recorded' && options.onUsageRecorded) {
      await options.onUsageRecorded(event);
    }
    return event;
  };
}

function getHeader(
  headers: Record<string, string | string[] | undefined>,
  name: string
): string | undefined {
  const value = headers[name] ?? headers[name.toLowerCase()];
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}
