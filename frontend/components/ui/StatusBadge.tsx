'use client';

import { type CSSProperties, PropsWithChildren } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Dot,
  Info,
  OctagonAlert,
  type LucideIcon
} from 'lucide-react';

import { getStatusToken, type StatusVariant } from '@/src/theme/statusTokens';

const variantIcons: Record<StatusVariant, LucideIcon> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  critical: OctagonAlert,
  info: Info,
  neutral: Dot
};

interface StatusBadgeProps extends PropsWithChildren {
  variant?: StatusVariant;
  tooltip?: string;
  icon?: LucideIcon;
  ariaLabel?: string;
  focusable?: boolean;
}

export function StatusBadge({
  children,
  variant = 'neutral',
  tooltip,
  icon,
  ariaLabel,
  focusable = false
}: StatusBadgeProps) {
  const token = getStatusToken(variant);
  const IconComponent = icon ?? variantIcons[variant];
  const customProperties = {
    '--status-badge-surface': token.surface,
    '--status-badge-text': token.text,
    '--status-badge-border': token.border,
    '--status-badge-icon': token.icon
  } as CSSProperties;

  return (
    <span
      className="status-badge"
      data-variant={variant}
      title={tooltip ?? undefined}
      role="status"
      aria-label={ariaLabel ?? undefined}
      tabIndex={focusable ? 0 : undefined}
      style={customProperties}
    >
      <IconComponent aria-hidden="true" className="status-badge__icon" size={14} strokeWidth={2} />
      <span className="status-badge__text">{children ?? token.label}</span>
      <style jsx>{`
        .status-badge {
          --status-badge-surface: var(--status-neutral-surface);
          --status-badge-text: var(--status-neutral-text);
          --status-badge-border: var(--status-neutral-border);
          --status-badge-icon: var(--status-neutral-icon);
          display: inline-flex;
          align-items: center;
          justify-content: flex-start;
          gap: var(--space-2);
          padding: 0 var(--space-3);
          min-height: 28px;
          border-radius: var(--radius-xs);
          font-size: 0.8125rem;
          font-weight: 600;
          background: var(--status-badge-surface);
          color: var(--status-badge-text);
          border: 1px solid var(--status-badge-border);
          transition: outline 0.2s ease;
        }
        .status-badge:focus-visible {
          outline: 2px solid var(--status-badge-border);
          outline-offset: 2px;
        }
        .status-badge__icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--status-badge-icon);
        }
        .status-badge__text {
          line-height: 1.2;
        }
      `}</style>
    </span>
  );
}
