import { CoreApiClient, CoreApiClientOptions } from './core.js';
import { HousekeepingApi } from './housekeeping.js';
import { IncidentApi } from './incidents.js';
import { NotificationApi } from './notifications.js';
export declare class BmadApiClient extends CoreApiClient {
    readonly housekeeping: HousekeepingApi;
    readonly incidents: IncidentApi;
    readonly notifications: NotificationApi;
    constructor(options: CoreApiClientOptions);
}
export declare function createApiClient(options: CoreApiClientOptions): BmadApiClient;
//# sourceMappingURL=client.d.ts.map