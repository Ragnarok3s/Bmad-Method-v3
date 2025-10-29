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
export declare class NotificationApi {
    private readonly client;
    constructor(client: CoreApiClient);
    registerDevice(ownerId: number, payload: PushDeviceRegistrationPayload): Promise<void>;
    unregisterDevice(ownerId: number, token: string): Promise<void>;
    listDevices(ownerId: number): Promise<PushDeviceRead[]>;
}
//# sourceMappingURL=notifications.d.ts.map