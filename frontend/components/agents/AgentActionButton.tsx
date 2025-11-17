'use client';

import clsx from 'clsx';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface AgentActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  loadingLabel?: string;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
}

export const AgentActionButton = forwardRef<HTMLButtonElement, AgentActionButtonProps>(
  (
    { label, loadingLabel = 'A processar…', isLoading = false, disabled, className, variant = 'primary', ...props },
    ref
  ) => {
    const isDisabled = disabled || isLoading;
    const content = isLoading ? loadingLabel : label;

    return (
      <>
        <button
          {...props}
          ref={ref}
          className={clsx('agent-action-button', `agent-action-button--${variant}`, className)}
          disabled={isDisabled}
          data-loading={isLoading || undefined}
        >
          {content}
        </button>
        <style jsx>{`
          .agent-action-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: var(--space-2);
            border-radius: var(--radius-sm);
            padding: var(--space-2) var(--space-4);
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s ease-in-out, color 0.2s ease-in-out, transform 0.2s ease-in-out;
            border: 1px solid transparent;
          }
          .agent-action-button--primary {
            background: var(--color-deep-blue);
            color: #fff;
          }
          .agent-action-button--primary:not(:disabled):hover,
          .agent-action-button--primary:not(:disabled):focus-visible {
            background: var(--color-ocean-blue);
            transform: translateY(-1px);
          }
          .agent-action-button--secondary {
            background: var(--color-neutral-0);
            border-color: var(--color-neutral-3);
            color: var(--color-deep-blue);
          }
          .agent-action-button--secondary:not(:disabled):hover,
          .agent-action-button--secondary:not(:disabled):focus-visible {
            background: var(--color-deep-blue);
            color: #fff;
          }
          .agent-action-button:focus-visible {
            outline: 3px solid var(--color-ocean-blue);
            outline-offset: 3px;
          }
          .agent-action-button:disabled {
            cursor: not-allowed;
            opacity: 0.6;
            transform: none;
          }
        `}</style>
      </>
    );
  }
);

AgentActionButton.displayName = 'AgentActionButton';
