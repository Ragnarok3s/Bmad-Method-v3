import { CoreApiError } from './housekeeping';

const CORE_API_BASE_URL =
  process.env.NEXT_PUBLIC_CORE_API_BASE_URL ?? 'http://localhost:8000';

interface LoginDto {
  session_id: string;
  agent_id: number;
  mfa_required: boolean;
  expires_at: string;
  session_timeout_seconds: number;
  recovery_codes_remaining: number;
}

interface RecoveryInitiateDto {
  email: string;
  issued_at: string;
  recovery_codes: string[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResult {
  sessionId: string;
  agentId: number;
  mfaRequired: boolean;
  expiresAt: string;
  sessionTimeoutSeconds: number;
  recoveryCodesRemaining: number;
}

export interface MfaVerificationPayload {
  sessionId: string;
  code: string;
  method?: 'totp' | 'recovery';
}

export interface RecoveryInitiation {
  email: string;
  issuedAt: string;
  recoveryCodes: string[];
}

export interface RecoveryCompletionPayload {
  email: string;
  code: string;
}

export async function login(payload: LoginPayload): Promise<LoginResult> {
  const url = new URL('/auth/login', CORE_API_BASE_URL);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const body = await safeReadJson(response);
    throw new CoreApiError('Failed to authenticate', response.status, body);
  }

  const dto = (await response.json()) as LoginDto;
  return mapLogin(dto);
}

export async function verifyMfa(payload: MfaVerificationPayload): Promise<LoginResult> {
  const url = new URL('/auth/mfa/verify', CORE_API_BASE_URL);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      session_id: payload.sessionId,
      code: payload.code,
      method: payload.method ?? 'totp'
    })
  });

  if (!response.ok) {
    const body = await safeReadJson(response);
    throw new CoreApiError('Failed to verify MFA', response.status, body);
  }

  const dto = (await response.json()) as LoginDto;
  return mapLogin(dto);
}

export async function initiateRecovery(email: string): Promise<RecoveryInitiation> {
  const url = new URL('/auth/recovery/initiate', CORE_API_BASE_URL);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  });

  if (!response.ok) {
    const body = await safeReadJson(response);
    throw new CoreApiError('Failed to initiate recovery', response.status, body);
  }

  const dto = (await response.json()) as RecoveryInitiateDto;
  return {
    email: dto.email,
    issuedAt: dto.issued_at,
    recoveryCodes: dto.recovery_codes
  };
}

export async function completeRecovery(
  payload: RecoveryCompletionPayload
): Promise<LoginResult> {
  const url = new URL('/auth/recovery/complete', CORE_API_BASE_URL);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: payload.email, code: payload.code })
  });

  if (!response.ok) {
    const body = await safeReadJson(response);
    throw new CoreApiError('Failed to complete recovery', response.status, body);
  }

  const dto = (await response.json()) as LoginDto;
  return mapLogin(dto);
}

function mapLogin(dto: LoginDto): LoginResult {
  return {
    sessionId: dto.session_id,
    agentId: dto.agent_id,
    mfaRequired: dto.mfa_required,
    expiresAt: dto.expires_at,
    sessionTimeoutSeconds: dto.session_timeout_seconds,
    recoveryCodesRemaining: dto.recovery_codes_remaining
  };
}

async function safeReadJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}
