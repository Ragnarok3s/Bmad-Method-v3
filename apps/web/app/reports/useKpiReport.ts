'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { KpiReportPayload } from '@/services/api/reports';
import { getKpiReport } from '@/services/api/reports';

export interface KpiReportFilters {
  startDate: string;
  endDate: string;
  propertyIds: number[];
}

export type ReportState =
  | { status: 'idle' | 'loading' | 'empty'; data?: KpiReportPayload }
  | { status: 'ready'; data: KpiReportPayload }
  | { status: 'error'; error: string };

export function useKpiReport(filters: KpiReportFilters) {
  const [state, setState] = useState<ReportState>({ status: 'idle' });
  const abortRef = useRef<AbortController | null>(null);

  const propertyKey = useMemo(() => filters.propertyIds.join(','), [filters.propertyIds]);

  const load = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((previous) => (previous.status === 'ready' ? previous : { status: 'loading' }));

    try {
      const payload = await getKpiReport({
        startDate: filters.startDate,
        endDate: filters.endDate,
        propertyIds: filters.propertyIds,
        signal: controller.signal
      });

      if (payload.items.length === 0) {
        setState({ status: 'empty' });
        return;
      }

      setState({ status: 'ready', data: payload });
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return;
      }
      setState({ status: 'error', error: (error as Error).message });
    }
  }, [filters.startDate, filters.endDate, propertyKey]);

  useEffect(() => {
    void load();
    return () => {
      abortRef.current?.abort();
    };
  }, [load]);

  const refresh = useCallback(() => {
    void load();
  }, [load]);

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
