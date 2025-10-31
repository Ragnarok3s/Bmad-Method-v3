import { CoreApiClient, CoreApiClientOptions } from './core.js';
import { HousekeepingApi } from './housekeeping.js';
import { IncidentApi } from './incidents.js';
import { NotificationApi } from './notifications.js';
import { ReservationApi } from './reservations.js';

export class BmadApiClient extends CoreApiClient {
  readonly housekeeping: HousekeepingApi;
  readonly incidents: IncidentApi;
  readonly notifications: NotificationApi;
  readonly reservations: ReservationApi;

  constructor(options: CoreApiClientOptions) {
    super(options);
    this.housekeeping = new HousekeepingApi(this);
    this.incidents = new IncidentApi(this);
    this.notifications = new NotificationApi(this);
    this.reservations = new ReservationApi(this);
  }
}

export function createApiClient(options: CoreApiClientOptions): BmadApiClient {
  return new BmadApiClient(options);
}
