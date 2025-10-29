import { createHmac, timingSafeEqual } from 'node:crypto';

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
    const expected = createHmac('sha256', options.secret).update(bodyBuffer).digest();
    const provided = toSignatureBuffer(signature, expected.length);
    if (!timingSafeEqual(expected, provided)) {
      throw new Error('Invalid webhook signature');
    }
    const event = JSON.parse(bodyBuffer.toString('utf-8')) as BillingWebhookEvent;
    if (event.event === 'billing.usage.recorded' && options.onUsageRecorded) {
      await options.onUsageRecorded(event);
    }
    return event;
  };
}

function toSignatureBuffer(signature: string, expectedLength: number): Buffer {
  const normalized = signature.trim();
  const requiredLength = expectedLength * 2;
  if (normalized.length !== requiredLength || !/^[0-9a-f]+$/i.test(normalized)) {
    throw new Error('Invalid webhook signature');
  }
  return Buffer.from(normalized, 'hex');
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
