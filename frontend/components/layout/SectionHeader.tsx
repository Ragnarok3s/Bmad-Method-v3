'use client';

import { PropsWithChildren } from 'react';

interface SectionHeaderProps extends PropsWithChildren {
  subtitle?: string;
  actions?: React.ReactNode;
}

export function SectionHeader({ children, subtitle, actions }: SectionHeaderProps) {
  return (
    <header className="section-header">
      <div>
        <h2>{children}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="section-actions">{actions}</div>}
      <style jsx>{`
        .section-header {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-3);
          align-items: flex-end;
          justify-content: space-between;
        }
        h2 {
          margin: 0;
          color: var(--color-neutral-3);
          font-size: 1.5rem;
          letter-spacing: -0.01em;
        }
        p {
          margin: var(--space-2) 0 0;
          color: var(--color-neutral-2);
          line-height: 1.5;
        }
      `}</style>
    </header>
  );
}
