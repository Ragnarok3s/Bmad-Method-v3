'use client';

import { PropsWithChildren } from 'react';

type Variant = 'success' | 'warning' | 'critical' | 'info' | 'neutral';

const variantStyles: Record<Variant, { background: string; color: string; icon: string; border: string }> = {
  success: {
    background: 'rgba(16, 185, 129, 0.14)',
    color: '#047857',
    icon: '●',
    border: 'rgba(16, 185, 129, 0.28)'
  },
  warning: {
    background: 'rgba(245, 158, 11, 0.16)',
    color: '#92400e',
    icon: '●',
    border: 'rgba(245, 158, 11, 0.32)'
  },
  critical: {
    background: 'rgba(239, 68, 68, 0.16)',
    color: '#b91c1c',
    icon: '●',
    border: 'rgba(239, 68, 68, 0.32)'
  },
  info: {
    background: 'rgba(37, 99, 235, 0.16)',
    color: '#1d4ed8',
    icon: '●',
    border: 'rgba(37, 99, 235, 0.32)'
  },
  neutral: {
    background: 'rgba(100, 116, 139, 0.14)',
    color: '#475569',
    icon: '●',
    border: 'rgba(100, 116, 139, 0.24)'
  }
};

interface StatusBadgeProps extends PropsWithChildren {
  variant?: Variant;
  tooltip?: string;
}

export function StatusBadge({ children, variant = 'neutral', tooltip }: StatusBadgeProps) {
  const { background, color, icon, border } = variantStyles[variant];
  return (
    <span className="status-badge" data-variant={variant} title={tooltip ?? undefined}>
      <span aria-hidden="true" className="status-badge__icon">
        {icon}
      </span>
      <span className="status-badge__text">{children}</span>
      <style jsx>{`
        .status-badge {
          display: inline-flex;
          align-items: center;
          justify-content: flex-start;
          gap: var(--space-2);
          padding: 0 var(--space-3);
          min-height: 28px;
          border-radius: var(--radius-xs);
          font-size: 0.8125rem;
          font-weight: 600;
          background: ${background};
          color: ${color};
          border: 1px solid ${border};
        }
        .status-badge__icon {
          font-size: 0.625rem;
          line-height: 1;
        }
        .status-badge__text {
          line-height: 1.2;
        }
      `}</style>
    </span>
  );
}
