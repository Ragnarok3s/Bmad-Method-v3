export class HousekeepingApi {
    constructor(client) {
        this.client = client;
    }
    async listTasks(query) {
        const { propertyId, signal, ...filters } = query;
        const payload = await this.client.request({
            path: `/properties/${propertyId}/housekeeping`,
            method: 'GET',
            query: filters,
            signal
        });
        return {
            items: payload.items.map(mapTask),
            pagination: mapPagination(payload.pagination)
        };
    }
    async updateTask(taskId, payload) {
        const dto = await this.client.request({
            path: `/housekeeping/tasks/${taskId}`,
            method: 'PATCH',
            body: payload
        });
        return mapTask(dto);
    }
}
function mapTask(dto) {
    return {
        id: dto.id,
        propertyId: dto.property_id,
        reservationId: dto.reservation_id,
        assignedAgentId: dto.assigned_agent_id,
        status: dto.status,
        scheduledDate: dto.scheduled_date,
        notes: dto.notes,
        createdAt: dto.created_at
    };
}
function mapPagination(dto) {
    return {
        page: dto.page,
        pageSize: dto.page_size,
        total: dto.total,
        totalPages: dto.total_pages
    };
}
