'use client';

import { PropsWithChildren } from 'react';

type Variant = 'success' | 'warning' | 'critical' | 'info' | 'neutral';

const variantStyles: Record<Variant, { background: string; color: string; icon: string }> = {
  success: { background: '#0f766e', color: '#ffffff', icon: '✔︎' },
  warning: { background: '#b45309', color: '#ffffff', icon: '⚠︎' },
  critical: { background: '#b91c1c', color: '#ffffff', icon: '⨉' },
  info: { background: '#1d4ed8', color: '#ffffff', icon: 'ℹ︎' },
  neutral: { background: '#374151', color: '#ffffff', icon: '●' }
};

interface StatusBadgeProps extends PropsWithChildren {
  variant?: Variant;
  tooltip?: string;
}

export function StatusBadge({ children, variant = 'neutral', tooltip }: StatusBadgeProps) {
  const { background, color, icon } = variantStyles[variant];
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
          border: 1px solid rgba(255, 255, 255, 0.24);
        }
        .status-badge__icon {
          font-size: 0.875rem;
          line-height: 1;
        }
        .status-badge__text {
          line-height: 1.2;
        }
      `}</style>
    </span>
  );
}
