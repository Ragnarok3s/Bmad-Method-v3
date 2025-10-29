import { CoreApiClient } from './core.js';
import { HousekeepingApi } from './housekeeping.js';
import { IncidentApi } from './incidents.js';
import { NotificationApi } from './notifications.js';
export class BmadApiClient extends CoreApiClient {
    constructor(options) {
        super(options);
        this.housekeeping = new HousekeepingApi(this);
        this.incidents = new IncidentApi(this);
        this.notifications = new NotificationApi(this);
    }
}
export function createApiClient(options) {
    return new BmadApiClient(options);
}
