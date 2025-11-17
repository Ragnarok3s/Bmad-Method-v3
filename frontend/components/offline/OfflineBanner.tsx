'use client';

import { useMemo } from 'react';
import { useOffline } from './OfflineContext';

export function OfflineBanner() {
  const { isOffline, lastChangedAt, pendingActions } = useOffline();

  const description = useMemo(() => {
    if (!isOffline && !lastChangedAt) return 'Conectado';
    if (!isOffline && lastChangedAt) {
      return `Conexão restabelecida há ${(Date.now() - lastChangedAt) / 1000 < 60 ? 'poucos segundos' : 'alguns minutos'}.`;
    }
    const pending = pendingActions.length ? `Ações pendentes: ${pendingActions.join(', ')}` : 'Sincronização automática quando a ligação voltar.';
    return `Você está offline. ${pending}`;
  }, [isOffline, lastChangedAt, pendingActions]);

  if (!isOffline && !lastChangedAt) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="offline-banner"
      data-offline={isOffline}
    >
      <span aria-hidden="true">{isOffline ? '⛔' : '✅'}</span>
      <p>{description}</p>
      <style jsx>{`
        .offline-banner {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: var(--space-3);
          align-items: center;
          background: ${isOffline ? 'var(--color-coral)' : 'var(--color-soft-aqua)'};
          color: #fff;
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-card);
        }
        .offline-banner p {
          margin: 0;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
