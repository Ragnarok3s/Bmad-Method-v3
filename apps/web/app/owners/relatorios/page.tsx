'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { fetchOwnerReports, OwnerReport, resolveOwnerToken } from '@/services/api/owners';
import { useOwnerAccess } from '../OwnerAccessContext';

export default function OwnerReportsPage() {
  const { ownerId, token } = useOwnerAccess();
  const [reports, setReports] = useState<OwnerReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const resolvedToken = useMemo(() => resolveOwnerToken(token), [token]);

  useEffect(() => {
    const abort = new AbortController();
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchOwnerReports(ownerId, resolvedToken);
        if (!abort.signal.aborted) {
          setReports(data);
        }
      } catch (err) {
        if (!abort.signal.aborted) {
          setError('Não foi possível carregar relatórios.');
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

  return (
    <div className="owners-reports">
      <SectionHeader subtitle="KPIs exportáveis para equipas financeiras e auditoria">Relatórios</SectionHeader>
      {error && <p className="owners-error">{error}</p>}
      {loading && <p className="owners-loading">A preparar relatórios…</p>}
      {!loading && (
        <div data-testid="owner-reports-list">
          <ResponsiveGrid columns={2}>
            {reports.map((report) => (
              <Card
                key={report.reportId}
                title={report.title}
                description={`Período ${report.period}`}
                accent={report.format === 'pdf' ? 'info' : 'success'}
              >
                <p className="owners-report-meta">
                  Gerado em {new Date(report.generatedAt).toLocaleString('pt-PT')}
                </p>
                <Link href={report.url} target="_blank" rel="noopener noreferrer">
                  Descarregar ({report.format.toUpperCase()})
                </Link>
              </Card>
            ))}
          </ResponsiveGrid>
        </div>
      )}
      <style jsx>{`
        .owners-reports {
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
        .owners-report-meta {
          margin: 0 0 var(--space-3) 0;
          color: var(--color-neutral-2);
        }
        a {
          display: inline-flex;
          gap: var(--space-2);
          align-items: center;
          font-weight: 600;
          color: var(--color-deep-blue);
        }
      `}</style>
    </div>
  );
}
