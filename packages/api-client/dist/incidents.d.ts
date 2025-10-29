import { CoreApiClient } from './core.js';
export type IncidentSeverity = 'low' | 'medium' | 'high';
export interface IncidentReportPayload {
    incident: string;
    severity: IncidentSeverity;
    reportedBy: string;
}
export interface IncidentSubmissionResponse {
    status: string;
}
export declare class IncidentApi {
    private readonly client;
    constructor(client: CoreApiClient);
    submit(ownerId: number, payload: IncidentReportPayload): Promise<IncidentSubmissionResponse>;
}
//# sourceMappingURL=incidents.d.ts.map