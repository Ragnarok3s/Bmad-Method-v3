import { CoreApiError } from './housekeeping';
import { CommunicationChannel } from '@/app/onboarding/types';

const CORE_API_BASE_URL =
  process.env.NEXT_PUBLIC_CORE_API_BASE_URL ?? 'http://localhost:8000';

export interface WorkspacePayload {
  name: string;
  timezone: string;
  teamSize: number;
  primaryUseCase: string;
  communicationChannel: CommunicationChannel;
  quarterlyGoal: string;
  inviteEmails: string[];
  teamRoles: string[];
  enableSandbox: boolean;
  requireMfa: boolean;
  securityNotes: string | null;
}

export interface Workspace {
  id: number;
  slug: string;
  name: string;
  timezone: string;
  teamSize: number;
  primaryUseCase: string;
  communicationChannel: CommunicationChannel;
  quarterlyGoal: string;
  inviteEmails: string[];
  teamRoles: string[];
  enableSandbox: boolean;
  requireMfa: boolean;
  securityNotes: string | null;
  createdAt: string;
}

interface WorkspaceDto {
  id: number;
  slug: string;
  name: string;
  timezone: string;
  team_size: number;
  primary_use_case: string;
  communication_channel: CommunicationChannel;
  quarterly_goal: string;
  invite_emails: string[];
  team_roles: string[];
  enable_sandbox: boolean;
  require_mfa: boolean;
  security_notes: string | null;
  created_at: string;
}

export async function createWorkspace(payload: WorkspacePayload): Promise<Workspace> {
  const url = new URL('/workspaces', CORE_API_BASE_URL);
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
    throw new CoreApiError('Failed to create workspace', response.status, body);
  }

  const dto = (await response.json()) as WorkspaceDto;
  return mapWorkspace(dto);
}

function mapWorkspace(dto: WorkspaceDto): Workspace {
  return {
    id: dto.id,
    slug: dto.slug,
    name: dto.name,
    timezone: dto.timezone,
    teamSize: dto.team_size,
    primaryUseCase: dto.primary_use_case,
    communicationChannel: dto.communication_channel,
    quarterlyGoal: dto.quarterly_goal,
    inviteEmails: dto.invite_emails,
    teamRoles: dto.team_roles,
    enableSandbox: dto.enable_sandbox,
    requireMfa: dto.require_mfa,
    securityNotes: dto.security_notes,
    createdAt: dto.created_at
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

function toSnakeCaseKeys<T extends Record<string, unknown>>(payload: T): Record<string, unknown> {
  return Object.entries(payload).reduce<Record<string, unknown>>((acc, [key, value]) => {
    if (value === undefined) {
      return acc;
    }

    if (Array.isArray(value)) {
      acc[toSnakeCase(key)] = value;
      return acc;
    }

    acc[toSnakeCase(key)] = value;
    return acc;
  }, {});
}
