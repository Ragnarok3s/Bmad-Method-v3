'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { metrics } from '@opentelemetry/api';

import { AgentsFilters } from '@/components/agents/AgentsFilters';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { AgentActionButton } from '@/components/agents/AgentActionButton';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAnalytics } from '@/components/analytics/AnalyticsContext';
import { useTenant } from '@/lib/tenant-context';
import { AgentAvailability, useAgentsCatalog } from '@/services/api/agents';

const AVAILABILITY_VARIANT: Record<AgentAvailability, 'success' | 'warning' | 'critical'> = {
  available: 'success',
  limited: 'warning',
  maintenance: 'critical'
};

const bundlesMeter = metrics.getMeter('bmad.web.bundles');
const bundleViewCounter = bundlesMeter.createCounter('bmad_web_bundle_view_total', {
  description: 'Total de visualizações dos bundles no catálogo web'
});
const bundleLaunchCounter = bundlesMeter.createCounter('bmad_web_bundle_launch_total', {
  description: 'Total de lançamentos de bundles iniciados pelo utilizador'
});
const bundleLaunchLatencyHistogram = bundlesMeter.createHistogram('bmad_web_bundle_launch_latency_ms', {
  description: 'Latência entre a primeira visualização e o lançamento de um bundle',
  unit: 'ms'
});

export interface AgentsCatalogCopy {
  header: { title: string; subtitle: string };
  loadingLabel: string;
  error: { title: string; description: string; actionLabel: string; actionLoadingLabel?: string };
  empty: { title: string; description: string; actionLabel: string };
  metadata: {
    competenciesTitle: string;
    integrationsTitle: string;
    automationLabel: string;
    automationFallback: string;
    languagesLabel: string;
    responseLabel: (value: number) => string;
    responseFallback: string;
  };
  pagination: {
    ariaLabel: string;
    previousLabel: string;
    nextLabel: string;
    summary: (page: number, totalPages: number, totalItems: number) => string;
  };
  bundleAction: { label: string; loadingLabel?: string };
}

interface AgentsCatalogViewProps {
  copy: AgentsCatalogCopy;
}

export function AgentsCatalogView({ copy }: AgentsCatalogViewProps) {
  const analytics = useAnalytics();
  const { tenant } = useTenant();
  const {
    items,
    availableFilters,
    filters,
    pagination,
    loading,
    error,
    setCompetencies,
    setAvailability,
    setPage,
    refresh
  } = useAgentsCatalog({ pageSize: 6 });

  const totalPages = pagination?.totalPages ?? (items.length > 0 ? 1 : 0);
  const totalItems = pagination?.total ?? items.length;
  const currentPage = filters.page;
  const workspaceSlug = useMemo(() => tenant?.slug ?? 'global', [tenant]);
  const errorAlertRef = useRef<HTMLDivElement | null>(null);
  const emptyAlertRef = useRef<HTMLDivElement | null>(null);
  const paginationRef = useRef<HTMLElement | null>(null);
  const previousPageRef = useRef<number>(currentPage);
  const viewedBundlesRef = useRef<Set<string>>(new Set());
  const viewTimestampsRef = useRef<Map<string, number>>(new Map());

  const makeBundleKey = useCallback(
    (bundleSlug: string) => `${workspaceSlug}::${bundleSlug}`,
    [workspaceSlug]
  );

  const registerBundleLaunch = useCallback(
    (bundleSlug: string, bundleType: string) => {
      const bundleKey = makeBundleKey(bundleSlug);
      const now = Date.now();
      const attributes = {
        bundle_id: bundleSlug,
        bundle_type: bundleType,
        workspace: workspaceSlug,
        context: 'agents_catalog'
      } as const;

      analytics.track('bundle_launch', attributes);
      bundleLaunchCounter.add(1, attributes);

      const firstView = viewTimestampsRef.current.get(bundleKey);
      if (typeof firstView === 'number') {
        const latency = Math.max(0, now - firstView);
        bundleLaunchLatencyHistogram.record(latency, attributes);
      }
    },
    [analytics, makeBundleKey, workspaceSlug]
  );

  useEffect(() => {
    if (error && errorAlertRef.current) {
      errorAlertRef.current.focus();
    }
  }, [error]);

  useEffect(() => {
    if (!loading && !error && items.length === 0 && emptyAlertRef.current) {
      emptyAlertRef.current.focus();
    }
  }, [loading, error, items.length]);

  useEffect(() => {
    if (loading || error) {
      return;
    }
    items.forEach((agent) => {
      const bundleKey = makeBundleKey(agent.slug);
      if (viewedBundlesRef.current.has(bundleKey)) {
        return;
      }
      viewedBundlesRef.current.add(bundleKey);
      viewTimestampsRef.current.set(bundleKey, Date.now());
      const attributes = {
        bundle_id: agent.slug,
        bundle_type: agent.role,
        workspace: workspaceSlug,
        context: 'agents_catalog'
      } as const;
      analytics.track('bundle_view', attributes);
      bundleViewCounter.add(1, attributes);
    });
  }, [analytics, error, items, loading, makeBundleKey, workspaceSlug]);

  useEffect(() => {
    if (!loading && totalItems > 0 && paginationRef.current && previousPageRef.current !== currentPage) {
      paginationRef.current.focus();
    }
    previousPageRef.current = currentPage;
  }, [currentPage, loading, totalItems]);

  return (
    <div className="agents-page">
      <SectionHeader subtitle={copy.header.subtitle}>{copy.header.title}</SectionHeader>

      <AgentsFilters
        competencies={availableFilters.competencies}
        availability={availableFilters.availability}
        selectedCompetencies={filters.competencies}
        selectedAvailability={filters.availability}
        onCompetenciesChange={setCompetencies}
        onAvailabilityChange={setAvailability}
        disabled={loading}
      />

      {error && (
        <div
          ref={errorAlertRef}
          className="agents-page__alert"
          role="alert"
          aria-live="assertive"
          tabIndex={-1}
        >
          <Card accent="critical" title={copy.error.title} description={copy.error.description}>
            <AgentActionButton
              type="button"
              onClick={refresh}
              label={copy.error.actionLabel}
              loadingLabel={copy.error.actionLoadingLabel ?? copy.error.actionLabel}
              isLoading={loading}
            />
          </Card>
        </div>
      )}

      {loading && !error && <p className="agents-page__loading">{copy.loadingLabel}</p>}

      {!loading && items.length === 0 && !error && (
        <div
          ref={emptyAlertRef}
          className="agents-page__alert"
          role="status"
          aria-live="polite"
          tabIndex={-1}
        >
          <Card accent="warning" title={copy.empty.title} description={copy.empty.description}>
            <AgentActionButton
              type="button"
              variant="secondary"
              onClick={() => {
                setCompetencies([]);
                setAvailability([]);
                setPage(1);
              }}
              label={copy.empty.actionLabel}
              disabled={loading}
            />
          </Card>
        </div>
      )}

      <ResponsiveGrid columns={3}>
        {items.map((agent) => (
          <Card key={agent.slug} title={agent.name} description={agent.tagline}>
            <StatusBadge variant={AVAILABILITY_VARIANT[agent.availability]}>
              {agent.availabilityLabel}
            </StatusBadge>
            <p className="agent-description">{agent.description}</p>
            <div className="agent-section">
              <strong>{copy.metadata.competenciesTitle}</strong>
              <ul>
                {agent.competencies.map((competency) => (
                  <li key={competency}>{competency}</li>
                ))}
              </ul>
            </div>
            {agent.integrations.length > 0 && (
              <div className="agent-section">
                <strong>{copy.metadata.integrationsTitle}</strong>
                <p>{agent.integrations.join(', ')}</p>
              </div>
            )}
            <div className="agent-metadata">
              <span>
                {copy.metadata.automationLabel}: {agent.automationLevel ?? copy.metadata.automationFallback}
              </span>
              <span>
                {copy.metadata.languagesLabel}: {agent.languages.join(', ')}
              </span>
              <span>
                {agent.responseTimeMinutes !== null
                  ? copy.metadata.responseLabel(agent.responseTimeMinutes)
                  : copy.metadata.responseFallback}
              </span>
            </div>
            <div className="agent-actions">
              <AgentActionButton
                type="button"
                onClick={() => registerBundleLaunch(agent.slug, agent.role)}
                label={copy.bundleAction.label}
                loadingLabel={copy.bundleAction.loadingLabel ?? copy.bundleAction.label}
                disabled={loading}
              />
            </div>
          </Card>
        ))}
      </ResponsiveGrid>

      {totalItems > 0 && (
        <nav
          ref={paginationRef}
          className="agents-pagination"
          aria-label={copy.pagination.ariaLabel}
          tabIndex={-1}
        >
          <AgentActionButton
            type="button"
            variant="secondary"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage <= 1 || loading}
            label={copy.pagination.previousLabel}
          />
          <span className="agents-pagination__summary" role="status" aria-live="polite" aria-atomic="true">
            {copy.pagination.summary(Math.min(currentPage, Math.max(totalPages, 1)), Math.max(totalPages, 1), totalItems)}
          </span>
          <AgentActionButton
            type="button"
            variant="secondary"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage >= totalPages || loading}
            label={copy.pagination.nextLabel}
          />
        </nav>
      )}

      <style jsx>{`
        .agents-page {
          display: grid;
          gap: var(--space-6);
        }
        .agents-page__loading {
          color: var(--color-neutral-2);
        }
        .agents-page__alert {
          outline: none;
        }
        .agents-page__alert:focus {
          outline: 3px solid var(--color-deep-blue);
          outline-offset: 6px;
        }
        .agent-description {
          margin: 0;
          color: var(--color-neutral-2);
        }
        .agent-section {
          display: grid;
          gap: var(--space-2);
        }
        .agent-section ul {
          margin: 0;
          padding-left: var(--space-5);
          display: grid;
          gap: var(--space-1);
        }
        .agent-metadata {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
          font-size: 0.875rem;
          color: var(--color-neutral-2);
        }
        .agent-actions {
          display: flex;
          justify-content: flex-end;
        }
        .agents-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-3);
          border-top: 1px solid var(--color-neutral-4);
          padding-top: var(--space-3);
        }
        .agents-pagination:focus {
          outline: 3px solid var(--color-deep-blue);
          outline-offset: 6px;
        }
        .agents-pagination__summary {
          flex: 1;
          text-align: center;
          color: var(--color-deep-blue);
          font-weight: 600;
        }
        @media (max-width: 960px) {
          .agents-pagination {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-2);
          }
          .agent-metadata {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
