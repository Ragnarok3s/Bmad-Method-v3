export class IncidentApi {
    constructor(client) {
        this.client = client;
    }
    async submit(ownerId, payload) {
        return this.client.request({
            path: `/owners/${ownerId}/incidents`,
            method: 'POST',
            body: payload
        });
    }
}
