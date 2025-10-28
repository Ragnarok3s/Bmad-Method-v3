import { CoreApiError } from './housekeeping';

const CORE_API_BASE_URL =
  process.env.NEXT_PUBLIC_CORE_API_BASE_URL ?? 'http://localhost:8000';

export interface PlaybookTemplatePayload {
  name: string;
  summary: string;
  tags: string[];
  steps: string[];
}

export interface PlaybookTemplate {
  id: number;
  name: string;
  summary: string;
  tags: string[];
  steps: string[];
  executionCount: number;
  lastExecutedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlaybookExecutionResponse {
  runId: string;
  playbookId: number;
  status: string;
  initiatedBy: string | null;
  startedAt: string;
  finishedAt: string | null;
  message: string;
}

interface PlaybookTemplateDto {
  id: number;
  name: string;
  summary: string;
  tags: string[];
  steps: string[];
  execution_count: number;
  last_executed_at: string | null;
  created_at: string;
  updated_at: string;
}

interface PlaybookExecutionDto {
  run_id: string;
  playbook_id: number;
  status: string;
  initiated_by: string | null;
  started_at: string;
  finished_at: string | null;
  message: string;
}

export async function listPlaybooks(signal?: AbortSignal): Promise<PlaybookTemplate[]> {
  const url = new URL('/playbooks', CORE_API_BASE_URL);
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
    cache: 'no-store'
  });

  if (!response.ok) {
    const body = await safeReadJson(response);
    throw new CoreApiError('Failed to load playbooks', response.status, body);
  }

  const payload = (await response.json()) as PlaybookTemplateDto[];
  return payload.map(mapTemplate);
}

export async function createPlaybook(
  payload: PlaybookTemplatePayload
): Promise<PlaybookTemplate> {
  const url = new URL('/playbooks', CORE_API_BASE_URL);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(toSnakeCaseKeys(payload))
  });

  if (!response.ok) {
    const body = await safeReadJson(response);
    throw new CoreApiError('Failed to create playbook', response.status, body);
  }

  const dto = (await response.json()) as PlaybookTemplateDto;
  return mapTemplate(dto);
}

export async function executePlaybook(
  playbookId: number,
  initiatedBy?: string | null
): Promise<PlaybookExecutionResponse> {
  const url = new URL(`/playbooks/${playbookId}/execute`, CORE_API_BASE_URL);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ initiated_by: initiatedBy ?? 'web-app', context: {} })
  });

  if (!response.ok) {
    const body = await safeReadJson(response);
    throw new CoreApiError('Failed to execute playbook', response.status, body);
  }

  const dto = (await response.json()) as PlaybookExecutionDto;
  return {
    runId: dto.run_id,
    playbookId: dto.playbook_id,
    status: dto.status,
    initiatedBy: dto.initiated_by,
    startedAt: dto.started_at,
    finishedAt: dto.finished_at,
    message: dto.message
  };
}

function mapTemplate(dto: PlaybookTemplateDto): PlaybookTemplate {
  return {
    id: dto.id,
    name: dto.name,
    summary: dto.summary,
    tags: dto.tags,
    steps: dto.steps,
    executionCount: dto.execution_count,
    lastExecutedAt: dto.last_executed_at,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at
  };
}

async function safeReadJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

function toSnakeCase(input: string): string {
  return input
    .replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)
    .replace(/^_/, '');
}

function toSnakeCaseKeys(payload: PlaybookTemplatePayload): Record<string, unknown> {
  return Object.entries(payload).reduce<Record<string, unknown>>((acc, [key, value]) => {
    if (Array.isArray(value)) {
      acc[toSnakeCase(key)] = value;
      return acc;
    }
    acc[toSnakeCase(key)] = value;
    return acc;
  }, {});
}
