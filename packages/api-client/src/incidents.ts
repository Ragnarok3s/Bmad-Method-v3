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

export class IncidentApi {
  constructor(private readonly client: CoreApiClient) {}

  async submit(ownerId: number, payload: IncidentReportPayload): Promise<IncidentSubmissionResponse> {
    return this.client.request<IncidentSubmissionResponse>({
      path: `/owners/${ownerId}/incidents`,
      method: 'POST',
      body: payload as unknown as Record<string, unknown>
    });
  }
}
