'use client';

import { PropsWithChildren } from 'react';

type CardProps = PropsWithChildren<{
  title?: string;
  description?: string;
  accent?: 'success' | 'warning' | 'critical' | 'info';
}>;

const accentStyles: Record<NonNullable<CardProps['accent']>, string> = {
  success: 'var(--color-soft-aqua)',
  warning: 'var(--color-calm-gold)',
  critical: 'var(--color-coral)',
  info: 'var(--color-deep-blue)'
};

export function Card({ title, description, accent, children }: CardProps) {
  return (
    <article className="card">
      {(title || description) && (
        <header>
          {title && <h3>{title}</h3>}
          {description && <p className="card-description">{description}</p>}
        </header>
      )}
      <div>{children}</div>
      <style jsx>{`
        .card {
          background: #fff;
          border-radius: var(--radius-md);
          padding: var(--space-5);
          box-shadow: var(--shadow-card);
          border-left: ${accent ? `6px solid ${accentStyles[accent]}` : 'none'};
          display: grid;
          gap: var(--space-4);
        }
        header h3 {
          margin: 0;
          font-size: 1.125rem;
          color: var(--color-deep-blue);
        }
        .card-description {
          margin: var(--space-2) 0 0;
          color: var(--color-neutral-2);
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
