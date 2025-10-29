import { CoreApiClient } from './core.js';

export type PushDevicePlatform = 'ios' | 'android' | 'web';

export interface PushDeviceRegistrationPayload {
  token: string;
  platform: PushDevicePlatform;
  deviceName?: string;
  expoPushToken?: string;
}

export interface PushDeviceRead {
  token: string;
  platform: PushDevicePlatform;
  deviceName?: string | null;
  lastSeenAt: string;
  enabled: boolean;
}

export class NotificationApi {
  constructor(private readonly client: CoreApiClient) {}

  async registerDevice(ownerId: number, payload: PushDeviceRegistrationPayload): Promise<void> {
    await this.client.request<void>({
      path: `/owners/${ownerId}/devices`,
      method: 'POST',
      body: payload as unknown as Record<string, unknown>
    });
  }

  async unregisterDevice(ownerId: number, token: string): Promise<void> {
    await this.client.request<void>({
      path: `/owners/${ownerId}/devices/${encodeURIComponent(token)}`,
      method: 'DELETE'
    });
  }

  async listDevices(ownerId: number): Promise<PushDeviceRead[]> {
    const payload = await this.client.request<PushDeviceRead[]>({
      path: `/owners/${ownerId}/devices`,
      method: 'GET'
    });
    return payload;
  }
}
