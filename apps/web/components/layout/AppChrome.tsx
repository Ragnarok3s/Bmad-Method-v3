'use client';

import { ReactNode } from 'react';
import { useOffline } from '@/components/offline/OfflineContext';
import { OfflineBanner } from '@/components/offline/OfflineBanner';
import { MainNav } from '@/components/navigation/MainNav';
import { TourDialog } from '@/components/tour/TourDialog';
import { TourLauncher } from '@/components/tour/TourLauncher';

export function AppChrome({ children }: { children: ReactNode }) {
  const { isOffline } = useOffline();

  return (
    <div className="shell" data-offline={isOffline}>
      <header className="shell__header" role="banner">
        <div>
          <p className="shell__product">Bmad Method v3 · Hospitality</p>
          <h1>Operações conectadas para equipas hoteleiras</h1>
          <p className="shell__subtitle">
            Monitorize agentes, automatize playbooks e sincronize tarefas mesmo offline.
          </p>
        </div>
        <TourLauncher />
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
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--space-5);
          background: linear-gradient(135deg, rgba(11, 60, 93, 0.95), rgba(46, 196, 182, 0.9));
          color: #fff;
          padding: var(--space-5);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-card);
        }
        .shell__product {
          margin: 0 0 var(--space-2) 0;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .shell__subtitle {
          margin: var(--space-3) 0 0;
          max-width: 38rem;
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
          .shell__body {
            grid-template-columns: minmax(0, 1fr);
          }
        }
        @media (max-width: 768px) {
          .shell {
            padding: var(--space-4);
          }
          .shell__header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
