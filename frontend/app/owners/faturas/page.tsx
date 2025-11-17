'use client';

import { useEffect, useMemo, useState } from 'react';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { fetchOwnerInvoices, OwnerInvoice, resolveOwnerToken } from '@/services/api/owners';
import { useOwnerAccess } from '../OwnerAccessContext';

const currencyFormatter = new Intl.NumberFormat('pt-PT', {
  style: 'currency',
  currency: 'EUR'
});

export default function OwnerInvoicesPage() {
  const { ownerId, token } = useOwnerAccess();
  const [invoices, setInvoices] = useState<OwnerInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const resolvedToken = useMemo(() => resolveOwnerToken(token), [token]);

  useEffect(() => {
    const abort = new AbortController();
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchOwnerInvoices(ownerId, resolvedToken);
        if (!abort.signal.aborted) {
          setInvoices(data);
        }
      } catch (err) {
        if (!abort.signal.aborted) {
          setError('Não foi possível carregar faturas.');
        }
      } finally {
        if (!abort.signal.aborted) {
          setLoading(false);
        }
      }
    }
    load();
    return () => abort.abort();
  }, [ownerId, resolvedToken]);

  const statusLabel = (status: OwnerInvoice['status']) => {
    switch (status) {
      case 'paid':
        return 'Liquidada';
      case 'pending':
        return 'Pendente';
      case 'overdue':
        return 'Vencida';
      default:
        return status;
    }
  };

  return (
    <div className="owners-invoices">
      <SectionHeader subtitle="Transparência de repasses e partilha de receita">Faturas & repasses</SectionHeader>
      {error && <p className="owners-error">{error}</p>}
      {loading && <p className="owners-loading">A carregar faturas…</p>}
      {!loading && (
        <div className="owners-table-wrapper">
          <table data-testid="owner-invoices-table">
            <thead>
              <tr>
                <th>Fatura</th>
                <th>Propriedade</th>
                <th>Vencimento</th>
                <th>Montante</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.invoiceId} data-status={invoice.status}>
                  <td>{invoice.invoiceId}</td>
                  <td>{invoice.propertyName}</td>
                  <td>{new Date(invoice.dueDate).toLocaleDateString('pt-PT')}</td>
                  <td>{currencyFormatter.format(invoice.amountDue)}</td>
                  <td>{statusLabel(invoice.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <style jsx>{`
        .owners-invoices {
          display: grid;
          gap: var(--space-5);
        }
        .owners-error {
          color: var(--color-coral);
          margin: 0;
        }
        .owners-loading {
          color: var(--color-neutral-2);
        }
        .owners-table-wrapper {
          overflow-x: auto;
          background: var(--color-neutral-0);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-card);
        }
        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 720px;
        }
        th,
        td {
          padding: var(--space-3) var(--space-4);
          text-align: left;
          border-bottom: 1px solid rgba(37, 99, 235, 0.12);
        }
        tbody tr[data-status='overdue'] td {
          color: var(--color-coral);
          font-weight: 600;
        }
        tbody tr[data-status='paid'] td {
          color: var(--color-deep-blue);
        }
      `}</style>
    </div>
  );
}
