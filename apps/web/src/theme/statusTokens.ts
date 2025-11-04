export type StatusVariant = 'success' | 'warning' | 'critical' | 'info' | 'neutral';

export const STATUS_VARIANTS: readonly StatusVariant[] = [
  'success',
  'warning',
  'critical',
  'info',
  'neutral'
] as const;

export interface StatusToken {
  surface: string;
  border: string;
  text: string;
  icon: string;
  label: string;
}

export const statusTokens: Record<StatusVariant, StatusToken> = {
  success: {
    surface: 'var(--status-success-surface)',
    border: 'var(--status-success-border)',
    text: 'var(--status-success-text)',
    icon: 'var(--status-success-icon)',
    label: 'Estado: sucesso'
  },
  warning: {
    surface: 'var(--status-warning-surface)',
    border: 'var(--status-warning-border)',
    text: 'var(--status-warning-text)',
    icon: 'var(--status-warning-icon)',
    label: 'Estado: alerta'
  },
  critical: {
    surface: 'var(--status-critical-surface)',
    border: 'var(--status-critical-border)',
    text: 'var(--status-critical-text)',
    icon: 'var(--status-critical-icon)',
    label: 'Estado: crítico'
  },
  info: {
    surface: 'var(--status-info-surface)',
    border: 'var(--status-info-border)',
    text: 'var(--status-info-text)',
    icon: 'var(--status-info-icon)',
    label: 'Estado: informativo'
  },
  neutral: {
    surface: 'var(--status-neutral-surface)',
    border: 'var(--status-neutral-border)',
    text: 'var(--status-neutral-text)',
    icon: 'var(--status-neutral-icon)',
    label: 'Estado: neutro'
  }
};

export function getStatusToken(variant: StatusVariant): StatusToken {
  return statusTokens[variant];
}
