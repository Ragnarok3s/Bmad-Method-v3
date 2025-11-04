'use client';

import { type CSSProperties, PropsWithChildren } from 'react';
import { AlertTriangle, CheckCircle2, Info, OctagonAlert, type LucideIcon } from 'lucide-react';

import { getStatusToken, type StatusVariant } from '@/src/theme/statusTokens';

type CardAccent = Extract<StatusVariant, 'success' | 'warning' | 'critical' | 'info'>;

type CardProps = PropsWithChildren<{
  title?: string;
  description?: string;
  accent?: CardAccent;
  accentLabel?: string;
  focusable?: boolean;
}>;

const accentIcons: Record<CardAccent, LucideIcon> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  critical: OctagonAlert,
  info: Info
};

export function Card({
  title,
  description,
  accent,
  accentLabel,
  focusable = false,
  children
}: CardProps) {
  const accentToken = accent ? getStatusToken(accent) : undefined;
  const AccentIcon = accent ? accentIcons[accent] : undefined;
  const accentText = accent ? accentLabel ?? accentToken?.label ?? '' : undefined;
  const customProperties = accent
    ? ({
        '--card-accent-border': accentToken?.border,
        '--card-accent-text': accentToken?.text,
        '--card-accent-icon': accentToken?.icon,
        '--card-accent-surface': accentToken?.surface
      } as CSSProperties)
    : undefined;
  const showHeader = Boolean(accent || title || description);

  return (
    <article
      className="card"
      data-accent={accent ?? 'none'}
      tabIndex={focusable ? 0 : undefined}
      style={customProperties}
    >
      {showHeader && (
        <header className="card__header">
          {accent && AccentIcon && (
            <div className="card__accent" data-variant={accent}>
              <AccentIcon aria-hidden="true" className="card__accent-icon" size={16} strokeWidth={2} />
              <span className="card__accent-label">{accentText}</span>
            </div>
          )}
          {title && <h3>{title}</h3>}
          {description && <p className="card-description">{description}</p>}
        </header>
      )}
      <div>{children}</div>
      <style jsx>{`
        .card {
          --card-accent-border: var(--color-soft-aqua);
          --card-accent-text: var(--color-neutral-2);
          --card-accent-icon: var(--color-neutral-2);
          --card-accent-surface: transparent;
          position: relative;
          background: var(--color-neutral-0);
          border-radius: var(--radius-md);
          padding: var(--space-5);
          box-shadow: var(--shadow-card);
          border: 1px solid var(--app-border-subtle);
          display: grid;
          gap: var(--space-5);
          transition: outline 0.2s ease;
        }
        .card:focus-visible {
          outline: 2px solid var(--card-accent-border);
          outline-offset: 4px;
        }
        .card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: calc(var(--radius-md) - 1px);
          border: 1px solid transparent;
          pointer-events: none;
        }
        .card[data-accent='success']::before,
        .card[data-accent='warning']::before,
        .card[data-accent='critical']::before,
        .card[data-accent='info']::before {
          border-top-color: var(--card-accent-border);
        }
        .card__header {
          display: grid;
          gap: var(--space-2);
        }
        .card__accent {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          align-self: flex-start;
          background: var(--card-accent-surface);
          color: var(--card-accent-text);
          padding: 2px var(--space-2);
          border-radius: var(--radius-xs);
          font-size: 0.75rem;
          font-weight: 600;
        }
        .card__accent-icon {
          color: var(--card-accent-icon);
        }
        .card__accent-label {
          line-height: 1.2;
        }
        header h3 {
          margin: 0;
          font-size: 1.125rem;
          color: var(--color-neutral-3);
          letter-spacing: -0.01em;
        }
        .card-description {
          margin: 0;
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
