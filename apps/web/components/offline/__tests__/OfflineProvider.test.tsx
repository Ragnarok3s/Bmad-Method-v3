import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useEffect, useState } from 'react';

import {
  OfflineProvider,
  useOffline
} from '../OfflineContext';
import { resetApiClient } from '@/services/api/client';
import { clearTaskUpdates } from '@/lib/offline-queue';

describe('OfflineProvider queue behaviour', () => {
  let onlineState = true;

  beforeAll(() => {
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      get: () => onlineState
    });
  });

  beforeEach(async () => {
    onlineState = true;
    const fetchMock = jest.fn() as unknown as typeof fetch;
    global.fetch = fetchMock;
    (globalThis as unknown as { fetch: typeof fetch }).fetch = fetchMock;
    resetApiClient();
    await clearTaskUpdates();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function goOffline() {
    act(() => {
      onlineState = false;
      window.dispatchEvent(new Event('offline'));
    });
  }

  function goOnline() {
    act(() => {
      onlineState = true;
      window.dispatchEvent(new Event('online'));
    });
  }

  function QueueTestHarness() {
    const { enqueueTaskUpdate, pendingActions, isOffline } = useOffline();

    return (
      <div>
        <span data-testid="is-offline">{String(isOffline)}</span>
        <span data-testid="pending-count">{pendingActions.length}</span>
        <button
          type="button"
          onClick={() => {
            void enqueueTaskUpdate({
              taskId: 1,
              updates: { status: 'completed' },
              description: 'Tarefa #1 → Concluída'
            });
          }}
        >
          enqueue
        </button>
      </div>
    );
  }

  it('queues offline mutations and flushes when connection returns', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        id: 1,
        property_id: 1,
        reservation_id: null,
        assigned_agent_id: null,
        status: 'completed',
        scheduled_date: new Date().toISOString(),
        notes: null,
        created_at: new Date().toISOString()
      })
    } as Response;

    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    render(
      <OfflineProvider>
        <QueueTestHarness />
      </OfflineProvider>
    );

    expect(screen.getByTestId('is-offline').textContent).toBe('false');

    goOffline();

    expect(screen.getByTestId('is-offline').textContent).toBe('true');

    await act(async () => {
      fireEvent.click(screen.getByText('enqueue'));
    });

    expect(screen.getByTestId('pending-count').textContent).toBe('1');
    expect(fetch).not.toHaveBeenCalled();

    goOnline();

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByTestId('pending-count').textContent).toBe('0');
    });
  });

  function ManualSyncHarness() {
    const { enqueueTaskUpdate, flushQueue, onManualSync } = useOffline();
    const [count, setCount] = useState(0);

    useEffect(() => onManualSync(() => setCount((value) => value + 1)), [onManualSync]);

    return (
      <div>
        <span data-testid="manual-count">{count}</span>
        <button
          type="button"
          onClick={async () => {
            await enqueueTaskUpdate({
              taskId: 2,
              updates: { status: 'completed' },
              description: 'Tarefa #2 → Concluída'
            });
            await flushQueue({ manual: true });
          }}
        >
          manual-sync
        </button>
      </div>
    );
  }

  it('notifies manual sync listeners when flushQueue is called manually', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        id: 2,
        property_id: 1,
        reservation_id: null,
        assigned_agent_id: null,
        status: 'completed',
        scheduled_date: new Date().toISOString(),
        notes: null,
        created_at: new Date().toISOString()
      })
    } as Response;

    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    render(
      <OfflineProvider>
        <ManualSyncHarness />
      </OfflineProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByText('manual-sync'));
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('manual-count').textContent).toBe('1');
    });
  });
});
