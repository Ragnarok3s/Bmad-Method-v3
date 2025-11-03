'use client';

import { PropsWithChildren } from 'react';

type FilterPillProps = PropsWithChildren<{
  label: string;
  selected?: boolean;
  count?: number;
  disabled?: boolean;
  onToggle?: (nextSelected: boolean) => void;
}>;

export function FilterPill({ label, selected = false, count, disabled = false, onToggle, children }: FilterPillProps) {
  const handleClick = () => {
    if (disabled) {
      return;
    }
    onToggle?.(!selected);
  };

  return (
    <button
      type="button"
      className={`filter-pill${selected ? ' filter-pill--selected' : ''}`}
      aria-pressed={selected}
      disabled={disabled}
      onClick={handleClick}
    >
      <span className="filter-pill__label">{label}</span>
      {typeof count === 'number' && <span className="filter-pill__count">{count}</span>}
      {children}
      <style jsx>{`
        .filter-pill {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          border-radius: 999px;
          border: 1px solid var(--color-neutral-4);
          background: var(--color-neutral-0);
          padding: var(--space-1) var(--space-3);
          cursor: pointer;
          font-size: 0.875rem;
          color: var(--color-deep-blue);
          transition: all 0.2s ease-in-out;
        }
        .filter-pill:hover:not(:disabled) {
          border-color: var(--color-deep-blue);
          box-shadow: 0 0 0 2px var(--tint-primary-soft);
        }
        .filter-pill:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
        .filter-pill--selected {
          background: var(--color-soft-aqua);
          border-color: var(--color-soft-aqua);
          color: var(--color-deep-blue);
        }
        .filter-pill__label {
          font-weight: 500;
        }
        .filter-pill__count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 1.5rem;
          height: 1.5rem;
          border-radius: 999px;
          background: var(--color-neutral-4);
          color: var(--color-deep-blue);
          font-size: 0.75rem;
          padding: 0 var(--space-1);
        }
      `}</style>
    </button>
  );
}
