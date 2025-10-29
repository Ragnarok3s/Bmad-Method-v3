'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { getAnalyticsTelemetry } from '@/telemetry/analytics';

export type GuestExperienceCheckInStep = {
  id: string;
  title: string;
  description?: string | null;
  completed: boolean;
  completed_at?: string | null;
};

export type GuestExperienceChatMessage = {
  id: string;
  author: string;
  direction: 'inbound' | 'outbound';
  channel: string;
  content: string;
  sent_at: string;
  status: string;
  template_id?: string | null;
  metadata: Record<string, unknown>;
};

export type GuestExperienceUpsell = {
  id: string;
  title: string;
  description: string;
  price_minor?: number | null;
  currency?: string | null;
  status: 'recommended' | 'accepted' | 'declined' | 'pending';
  conversion_probability?: number | null;
};

export type GuestExperienceReservation = {
  id: number;
  property_id: number;
  guest_name: string;
  guest_email: string;
  status: string;
  check_in: string;
  check_out: string;
  total_amount_minor?: number | null;
  currency_code?: string | null;
  capture_on_check_in: boolean;
  created_at: string;
};

export type GuestExperienceOverview = {
  reservation: GuestExperienceReservation;
  check_in: GuestExperienceCheckInStep[];
  chat: GuestExperienceChatMessage[];
  upsells: GuestExperienceUpsell[];
  preferences: Record<string, unknown>;
  satisfaction_score?: number | null;
  journey_stage?: string | null;
};

type GuestExperienceState =
  | { status: 'idle' | 'loading'; data?: GuestExperienceOverview }
  | { status: 'ready'; data: GuestExperienceOverview }
  | { status: 'error'; error: string };

function baseUrl() {
  return (
    process.env.NEXT_PUBLIC_CORE_API_BASE_URL ??
    process.env.CORE_API_BASE_URL ??
    'http://localhost:8000'
  ).replace(/\/$/, '');
}

export function useGuestExperience(reservationId: number) {
  const [state, setState] = useState<GuestExperienceState>({ status: 'idle' });
  const abortRef = useRef<AbortController | null>(null);
  const telemetry = getAnalyticsTelemetry();

  const loadExperience = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((previous) =>
      previous.status === 'ready' ? { status: 'loading', data: previous.data } : { status: 'loading' }
    );

    const start = performance.now();
    const span = telemetry?.startSpan('guest_experience.fetch.overview', {
      endpoint: `/guest-experience/${reservationId}`
    });

    try {
      const response = await fetch(`${baseUrl()}/guest-experience/${reservationId}`, {
        headers: { Accept: 'application/json' },
        signal: controller.signal
      });
      const duration = performance.now() - start;
      telemetry?.recordFetch(duration, {
        endpoint: 'guest_experience.overview',
        status: response.ok ? 'success' : 'error'
      });
      span?.end(response.ok ? 'success' : 'error', { http_status: response.status });

      if (!response.ok) {
        throw new Error(`Falha ao carregar experiência (${response.status})`);
      }

      const payload = (await response.json()) as GuestExperienceOverview;
      setState({ status: 'ready', data: payload });
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        span?.end('error', { reason: 'aborted' });
        return;
      }
      span?.end('error', { reason: 'exception' });
      setState({ status: 'error', error: (error as Error).message });
    }
  }, [reservationId, telemetry]);

  useEffect(() => {
    void loadExperience();
    return () => abortRef.current?.abort();
  }, [loadExperience]);

  const refresh = useCallback(() => loadExperience(), [loadExperience]);

  return useMemo(() => {
    if (state.status === 'error') {
      return { status: 'error' as const, error: state.error, refresh };
    }
    if (state.status === 'ready') {
      return { status: 'ready' as const, data: state.data, refresh };
    }
    return { status: state.status, data: 'data' in state ? state.data : undefined, refresh };
  }, [state, refresh]);
}
