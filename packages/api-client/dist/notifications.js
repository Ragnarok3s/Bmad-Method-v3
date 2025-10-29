export class NotificationApi {
    constructor(client) {
        this.client = client;
    }
    async registerDevice(ownerId, payload) {
        await this.client.request({
            path: `/owners/${ownerId}/devices`,
            method: 'POST',
            body: payload
        });
    }
    async unregisterDevice(ownerId, token) {
        await this.client.request({
            path: `/owners/${ownerId}/devices/${encodeURIComponent(token)}`,
            method: 'DELETE'
        });
    }
    async listDevices(ownerId) {
        const payload = await this.client.request({
            path: `/owners/${ownerId}/devices`,
            method: 'GET'
        });
        return payload;
    }
}
