'use client';

import { PropsWithChildren } from 'react';

type CardProps = PropsWithChildren<{
  title?: string;
  description?: string;
  accent?: 'success' | 'warning' | 'critical' | 'info';
}>;

const accentStyles: Record<NonNullable<CardProps['accent']>, string> = {
  success: 'var(--color-success)',
  warning: 'var(--color-calm-gold)',
  critical: 'var(--color-coral)',
  info: 'var(--color-soft-aqua)'
};

export function Card({ title, description, accent, children }: CardProps) {
  return (
    <article className="card" data-accent={accent ?? 'none'}>
      {(title || description) && (
        <header>
          {title && <h3>{title}</h3>}
          {description && <p className="card-description">{description}</p>}
        </header>
      )}
      <div>{children}</div>
      <style jsx>{`
        .card {
          position: relative;
          background: var(--color-neutral-0);
          border-radius: var(--radius-md);
          padding: var(--space-5);
          box-shadow: var(--shadow-card);
          border: 1px solid var(--app-border-subtle);
          display: grid;
          gap: var(--space-5);
        }
        .card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: calc(var(--radius-md) - 1px);
          border: 1px solid transparent;
          pointer-events: none;
        }
        .card[data-accent='success']::before {
          border-top-color: ${accentStyles.success};
        }
        .card[data-accent='warning']::before {
          border-top-color: ${accentStyles.warning};
        }
        .card[data-accent='critical']::before {
          border-top-color: ${accentStyles.critical};
        }
        .card[data-accent='info']::before {
          border-top-color: ${accentStyles.info};
        }
        header h3 {
          margin: 0;
          font-size: 1.125rem;
          color: var(--color-neutral-3);
          letter-spacing: -0.01em;
        }
        .card-description {
          margin: var(--space-2) 0 0;
          color: var(--color-neutral-2);
          line-height: 1.5;
        }
        @media (max-width: 768px) {
          .card {
            padding: var(--space-4);
          }
        }
      `}</style>
    </article>
  );
}
