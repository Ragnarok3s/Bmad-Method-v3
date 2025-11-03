'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import clsx from 'clsx';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <>
      <button
        type="button"
        onClick={toggleTheme}
        className={clsx('theme-toggle', className)}
        aria-pressed={isDark}
        title={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      >
        <span className="sr-only">Alternar modo {isDark ? 'claro' : 'escuro'}</span>
        <Sun className="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true" />
        <Moon className="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true" />
      </button>
      <style jsx>{`
        .theme-toggle {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--app-border-subtle);
          background: var(--app-surface-muted);
          color: var(--color-neutral-3);
          transition: background 0.2s ease, border 0.2s ease, color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .theme-toggle:hover,
        .theme-toggle:focus-visible {
          background: var(--tint-neutral-soft);
          border-color: var(--tint-primary-strong);
          color: var(--color-deep-blue);
          box-shadow: var(--shadow-card);
        }

        .theme-toggle__icon {
          position: absolute;
          width: 18px;
          height: 18px;
          color: inherit;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }

        .theme-toggle__icon--sun {
          opacity: 1;
          transform: translateY(0);
        }

        .theme-toggle__icon--moon {
          opacity: 0;
          transform: translateY(-12px);
        }

        .theme-toggle[aria-pressed='true'] {
          color: #fbbf24;
        }

        .theme-toggle[aria-pressed='true'] .theme-toggle__icon--sun {
          opacity: 0;
          transform: translateY(12px);
        }

        .theme-toggle[aria-pressed='true'] .theme-toggle__icon--moon {
          opacity: 1;
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .theme-toggle,
          .theme-toggle__icon {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}
