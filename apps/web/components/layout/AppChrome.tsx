'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { useOffline } from '@/components/offline/OfflineContext';
import { OfflineBanner } from '@/components/offline/OfflineBanner';
import { MainNav } from '@/components/navigation/MainNav';
import { TourDialog } from '@/components/tour/TourDialog';

const DATE_FORMATTER = new Intl.DateTimeFormat('pt-PT', {
  weekday: 'long',
  day: 'numeric',
  month: 'long'
});

const TIME_FORMATTER = new Intl.DateTimeFormat('pt-PT', {
  hour: '2-digit',
  minute: '2-digit'
});

export function AppChrome({ children }: { children: ReactNode }) {
  const { isOffline } = useOffline();
  const now = new Date();
  const todayLabel = DATE_FORMATTER.format(now);
  const timeLabel = TIME_FORMATTER.format(now);

  return (
    <div className="shell" data-offline={isOffline}>
      <header className="shell__header" role="banner">
        <div className="shell__brand">
          <span className="shell__logo" aria-hidden="true">
            BM
          </span>
          <div>
            <p className="shell__product">Bmad Local Stays</p>
            <h1>Centro operacional para alojamentos locais</h1>
          </div>
        </div>
        <div className="shell__context" aria-live="polite">
          <p className="shell__context-label">Portefólio ativo</p>
          <p className="shell__context-title">Porto Riverside Collection</p>
          <p className="shell__context-meta">
            {todayLabel} · {timeLabel}
          </p>
        </div>
        <div className="shell__auth" role="navigation" aria-label="Acesso e autenticação">
          <p className="shell__auth-label">Acesso seguro</p>
          <Link href="/login" className="shell__auth-link">
            Entrar na conta
          </Link>
          <p className="shell__auth-meta">Gestores, housekeeping e proprietários</p>
        </div>
        <div className="shell__actions">
          <button type="button" className="shell__action shell__action--primary">
            Sincronizar OTAs
          </button>
          <button type="button" className="shell__action shell__action--secondary">
            Registar incidente
          </button>
        </div>
      </header>
      <OfflineBanner />
      <div className="shell__body">
        <aside className="shell__sidebar">
          <MainNav />
        </aside>
        <main id="conteudo-principal" className="shell__content" tabIndex={-1}>
          {children}
        </main>
      </div>
      <TourDialog />
      <style jsx>{`
        .shell {
          display: grid;
          gap: var(--space-5);
          padding: var(--space-5) var(--space-6);
        }
        .shell__header {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.9fr) minmax(0, 0.9fr) auto;
          align-items: center;
          gap: var(--space-5);
          background: #fff;
          padding: var(--space-4) var(--space-5);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-card);
          border: 1px solid rgba(11, 60, 93, 0.08);
        }
        .shell__brand {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }
        .shell__logo {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          background: linear-gradient(135deg, rgba(11, 60, 93, 0.95), rgba(46, 196, 182, 0.8));
          color: #fff;
        }
        .shell__product {
          margin: 0 0 var(--space-2) 0;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 600;
          color: var(--color-neutral-2);
        }
        .shell__brand h1 {
          margin: 0;
          font-size: 1.5rem;
          color: var(--color-deep-blue);
        }
        .shell__context {
          display: grid;
          gap: var(--space-1);
          justify-items: start;
        }
        .shell__context-label {
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.75rem;
          color: var(--color-neutral-2);
        }
        .shell__context-title {
          margin: 0;
          font-weight: 600;
          font-size: 1.125rem;
          color: var(--color-deep-blue);
        }
        .shell__context-meta {
          margin: 0;
          color: var(--color-neutral-2);
        }
        .shell__auth {
          display: grid;
          gap: var(--space-1);
          justify-items: start;
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-sm);
          background: rgba(11, 60, 93, 0.05);
          border: 1px solid rgba(11, 60, 93, 0.08);
        }
        .shell__auth-label {
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.75rem;
          color: var(--color-neutral-2);
        }
        .shell__auth-link {
          font-weight: 600;
          color: var(--color-deep-blue);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
        }
        .shell__auth-link::after {
          content: '↗';
          font-size: 0.85em;
          transition: transform 0.2s ease;
        }
        .shell__auth-link:hover,
        .shell__auth-link:focus-visible {
          color: #07273b;
        }
        .shell__auth-link:hover::after,
        .shell__auth-link:focus-visible::after {
          transform: translateX(2px);
        }
        .shell__auth-meta {
          margin: 0;
          font-size: 0.8125rem;
          color: var(--color-neutral-2);
        }
        .shell__actions {
          display: inline-flex;
          gap: var(--space-3);
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .shell__action {
          font-weight: 600;
          border-radius: var(--radius-sm);
          padding: var(--space-2) var(--space-4);
          cursor: pointer;
          border: 1px solid transparent;
          transition: background 0.2s ease, color 0.2s ease, border 0.2s ease;
        }
        .shell__action--primary {
          background: var(--color-deep-blue);
          color: #fff;
        }
        .shell__action--primary:hover,
        .shell__action--primary:focus-visible {
          background: #07273b;
        }
        .shell__action--secondary {
          background: rgba(46, 196, 182, 0.12);
          color: var(--color-deep-blue);
          border-color: rgba(46, 196, 182, 0.35);
        }
        .shell__action--secondary:hover,
        .shell__action--secondary:focus-visible {
          background: rgba(46, 196, 182, 0.2);
        }
        .shell__body {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: var(--space-5);
        }
        .shell__sidebar {
          min-width: 0;
        }
        .shell__content {
          display: grid;
          gap: var(--space-5);
        }
        @media (max-width: 1200px) {
          .shell {
            padding: var(--space-5);
          }
          .shell__header {
            grid-template-columns: minmax(0, 1fr);
            justify-items: stretch;
          }
          .shell__auth {
            width: 100%;
            padding: var(--space-3) var(--space-4);
          }
          .shell__actions {
            justify-content: flex-start;
          }
          .shell__body {
            grid-template-columns: minmax(0, 1fr);
          }
        }
        @media (max-width: 768px) {
          .shell {
            padding: var(--space-4);
          }
          .shell__actions {
            width: 100%;
          }
          .shell__actions .shell__action {
            flex: 1 1 auto;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
