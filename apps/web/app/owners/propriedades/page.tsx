'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { SectionHeader } from '@/components/layout/SectionHeader';
import {
  fetchOwnerProperties,
  OwnerPropertySummary,
  resolveOwnerToken
} from '@/services/api/owners';
import { useOwnerAccess } from '../OwnerAccessContext';

const percentFormatter = new Intl.NumberFormat('pt-PT', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

const currencyFormatter = new Intl.NumberFormat('pt-PT', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0
});

export default function OwnerPropertiesPage() {
  const { ownerId, token } = useOwnerAccess();
  const [properties, setProperties] = useState<OwnerPropertySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const resolvedToken = useMemo(() => resolveOwnerToken(token), [token]);

  useEffect(() => {
    const abort = new AbortController();
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchOwnerProperties(ownerId, resolvedToken);
        if (!abort.signal.aborted) {
          setProperties(data);
        }
      } catch (err) {
        if (!abort.signal.aborted) {
          setError('Não foi possível carregar propriedades.');
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
    <div className="owners-properties">
      <SectionHeader subtitle="Desempenho por propriedade com indicadores operacionais">Propriedades</SectionHeader>
      {error && <p className="owners-error">{error}</p>}
      {loading && <p className="owners-loading">A carregar inventário…</p>}
      {!loading && (
        <div data-testid="owner-properties-list">
          <ResponsiveGrid columns={2}>
            {properties.map((property) => (
              <Card
                key={property.propertyId}
                title={property.propertyName}
                description={`Ocupação ${percentFormatter.format(property.occupancyRate)} · ADR ${currencyFormatter.format(property.adr)}`}
                accent={property.issuesOpen > 1 ? 'critical' : property.issuesOpen === 1 ? 'warning' : 'success'}
              >
                <dl className="owners-property-grid">
                  <div>
                    <dt>Receita MTD</dt>
                    <dd>{currencyFormatter.format(property.revenueMtd)}</dd>
                  </div>
                  <div>
                    <dt>Incidentes</dt>
                    <dd>{property.issuesOpen}</dd>
                  </div>
                  <div>
                    <dt>Último incidente</dt>
                    <dd>
                      {property.lastIncidentAt
                        ? new Date(property.lastIncidentAt).toLocaleDateString('pt-PT')
                        : 'Sem ocorrências recentes'}
                    </dd>
                  </div>
                </dl>
              </Card>
            ))}
          </ResponsiveGrid>
        </div>
      )}
      <style jsx>{`
        .owners-properties {
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
        .owners-property-grid {
          margin: 0;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: var(--space-3);
        }
        .owners-property-grid div {
          background: rgba(37, 99, 235, 0.06);
          border-radius: var(--radius-sm);
          padding: var(--space-3);
        }
        dt {
          margin: 0;
          font-size: 0.875rem;
          color: var(--color-neutral-2);
        }
        dd {
          margin: var(--space-1) 0 0;
          font-size: 1.1rem;
          font-weight: 600;
        }
        @media (max-width: 960px) {
          .owners-property-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
