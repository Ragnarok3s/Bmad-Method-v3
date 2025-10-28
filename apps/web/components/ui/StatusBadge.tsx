'use client';

import { PropsWithChildren } from 'react';

type Variant = 'success' | 'warning' | 'critical' | 'info' | 'neutral';

const variantStyles: Record<Variant, { background: string; color: string }> = {
  success: { background: 'rgba(46, 196, 182, 0.12)', color: 'var(--color-soft-aqua)' },
  warning: { background: 'rgba(224, 164, 88, 0.18)', color: 'var(--color-calm-gold)' },
  critical: { background: 'rgba(239, 99, 81, 0.15)', color: 'var(--color-coral)' },
  info: { background: 'rgba(11, 60, 93, 0.12)', color: 'var(--color-deep-blue)' },
  neutral: { background: 'rgba(107, 114, 128, 0.16)', color: 'var(--color-neutral-2)' }
};

interface StatusBadgeProps extends PropsWithChildren {
  variant?: Variant;
}

export function StatusBadge({ children, variant = 'neutral' }: StatusBadgeProps) {
  const { background, color } = variantStyles[variant];
  return (
    <span className="status-badge">
      {children}
      <style jsx>{`
        .status-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 var(--space-2);
          min-height: 24px;
          border-radius: var(--radius-xs);
          font-size: 0.75rem;
          font-weight: 600;
          background: ${background};
          color: ${color};
        }
      `}</style>
    </span>
  );
}
