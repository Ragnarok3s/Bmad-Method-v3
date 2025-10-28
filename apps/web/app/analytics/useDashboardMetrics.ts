'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { getAnalyticsTelemetry } from '@/telemetry/analytics';

export type DashboardMetrics = {
  occupancy: {
    date: string;
    occupancy_rate: number;
    occupied_units: number;
    total_units: number;
  };
  nps: {
    score: number;
    promoters: number;
    detractors: number;
    passives: number;
    total_responses: number;
    trend_7d: number | null;
  };
  sla: {
    total: number;
    on_track: number;
    at_risk: number;
    breached: number;
    worst_offenders: string[];
  };
  operational: {
    critical_alerts: {
      total: number;
      blocked: number;
      overdue: number;
      examples: Array<{ task_id: number; property_id: number; scheduled_date: string; status: string }>;
    };
    playbook_adoption: {
      total_executions: number;
      completed: number;
      adoption_rate: number;
      active_properties: number;
      period_start: string;
      period_end: string;
    };
    housekeeping_completion_rate: {
      value: number;
      status: string | null;
    };
    ota_sync_backlog: {
      value: number;
      status: string | null;
    };
  };
};

type DashboardState =
  | { status: 'idle' | 'loading' | 'empty'; data?: DashboardMetrics }
  | { status: 'ready'; data: DashboardMetrics }
  | { status: 'error'; error: string };

const CACHE_TTL = 60_000;

let cachedMetrics: { data: DashboardMetrics | null; expiresAt: number } = {
  data: null,
  expiresAt: 0
};

function baseUrl() {
  return (
    process.env.NEXT_PUBLIC_CORE_API_BASE_URL ??
    process.env.CORE_API_BASE_URL ??
    'http://localhost:8000'
  ).replace(/\/$/, '');
}

function isEmptyPayload(payload: DashboardMetrics) {
  return (
    payload.nps.total_responses === 0 &&
    payload.operational.critical_alerts.total === 0 &&
    payload.operational.playbook_adoption.total_executions === 0
  );
}

export function useDashboardMetrics() {
  const [state, setState] = useState<DashboardState>({ status: 'idle' });
  const abortRef = useRef<AbortController | null>(null);
  const telemetry = getAnalyticsTelemetry();

  const loadMetrics = useCallback(
    async (force = false) => {
      if (!force && cachedMetrics.data && cachedMetrics.expiresAt > Date.now()) {
        setState({ status: 'ready', data: cachedMetrics.data });
        telemetry?.recordFetch(0, { cache: 'hit', endpoint: 'metrics.overview' });
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setState((previous) =>
        previous.status === 'ready' ? previous : { status: 'loading' }
      );

      const start = performance.now();
      const span = telemetry?.startSpan('analytics.fetch.metrics', {
        endpoint: '/metrics/overview'
      });

      try {
        const response = await fetch(`${baseUrl()}/metrics/overview`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' }
        });
        const duration = performance.now() - start;
        telemetry?.recordFetch(duration, {
          cache: 'miss',
          endpoint: 'metrics.overview',
          status: response.ok ? 'success' : 'error'
        });
        span?.end(response.ok ? 'success' : 'error', {
          http_status: response.status
        });

        if (!response.ok) {
          throw new Error(`Falha ao carregar métricas (${response.status})`);
        }

        const payload = (await response.json()) as DashboardMetrics;
        if (isEmptyPayload(payload)) {
          cachedMetrics = { data: null, expiresAt: Date.now() + CACHE_TTL };
          setState({ status: 'empty' });
          return;
        }

        cachedMetrics = { data: payload, expiresAt: Date.now() + CACHE_TTL };
        setState({ status: 'ready', data: payload });
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          span?.end('error', { reason: 'aborted' });
          return;
        }
        span?.end('error', { reason: 'exception' });
        setState({ status: 'error', error: (error as Error).message });
      }
    },
    [telemetry]
  );

  useEffect(() => {
    void loadMetrics(false);
    return () => {
      abortRef.current?.abort();
    };
  }, [loadMetrics]);

  const refresh = useCallback(() => loadMetrics(true), [loadMetrics]);

  const value = useMemo(
    () => ({
      status: state.status,
      data: 'data' in state ? state.data : undefined,
      error: state.status === 'error' ? state.error : undefined,
      refresh
    }),
    [state, refresh]
  );

  return value;
}
