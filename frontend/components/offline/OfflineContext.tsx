'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import {
  enqueueTaskUpdate as enqueueTaskUpdateInQueue,
  readTaskUpdates,
  removeTaskUpdate as removeTaskUpdateInQueue,
  type EnqueueTaskUpdateInput,
  type OfflineTaskMutation
} from '@/lib/offline-queue';
import { updateHousekeepingTask } from '@/services/api/housekeeping';

interface OfflineContextValue {
  isOffline: boolean;
  lastChangedAt: number | null;
  pendingActions: string[];
  enqueueTaskUpdate: (input: EnqueueTaskUpdateInput) => Promise<OfflineTaskMutation>;
  removeTaskUpdate: (id: string) => Promise<void>;
  flushQueue: (options?: { manual?: boolean }) => Promise<void>;
  onManualSync: (listener: () => void) => () => void;
  isSyncing: boolean;
}

const OfflineContext = createContext<OfflineContextValue | undefined>(undefined);

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [lastChangedAt, setLastChangedAt] = useState<number | null>(null);
  const [pendingMutations, setPendingMutations] = useState<OfflineTaskMutation[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const manualSyncListeners = useRef(new Set<() => void>());

  const isClient = typeof window !== 'undefined';

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const syncInitialStatus = () => {
      const offline = !navigator.onLine;
      setIsOffline(offline);
      if (offline) {
        setLastChangedAt(Date.now());
      }
    };

    syncInitialStatus();

    const handleOnline = () => {
      setIsOffline(false);
      setLastChangedAt(Date.now());
    };

    const handleOffline = () => {
      setIsOffline(true);
      setLastChangedAt(Date.now());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const refreshPendingMutations = useCallback(async () => {
    if (!isClient) {
      return;
    }
    try {
      const mutations = await readTaskUpdates();
      setPendingMutations(mutations);
    } catch (error) {
      console.error('Não foi possível ler fila offline', error);
    }
  }, [isClient]);

  useEffect(() => {
    void refreshPendingMutations();
  }, [refreshPendingMutations]);

  const enqueueTaskUpdate = useCallback(
    async (input: EnqueueTaskUpdateInput) => {
      const mutation = await enqueueTaskUpdateInQueue(input);
      setPendingMutations((prev) =>
        [...prev, mutation].sort((a, b) => a.createdAt - b.createdAt)
      );
      if (isOffline) {
        setLastChangedAt(Date.now());
      }
      return mutation;
    },
    [isOffline]
  );

  const removeTaskUpdate = useCallback(async (id: string) => {
    await removeTaskUpdateInQueue(id);
    setPendingMutations((prev) => prev.filter((mutation) => mutation.id !== id));
  }, []);

  const flushQueue = useCallback(
    async ({ manual = false }: { manual?: boolean } = {}) => {
      if (isOffline || !isClient) {
        return;
      }

      setIsSyncing(true);
      let hasSynced = false;

      try {
        const queuedMutations = await readTaskUpdates();
        for (const mutation of queuedMutations) {
          try {
            await updateHousekeepingTask(mutation.taskId, mutation.updates);
            await removeTaskUpdateInQueue(mutation.id);
            hasSynced = true;
          } catch (error) {
            console.error('Falha ao reenviar mutação offline', error);
            break;
          }
        }
      } finally {
        await refreshPendingMutations();
        setIsSyncing(false);
        if (hasSynced) {
          setLastChangedAt(Date.now());
        }
        if (manual) {
          manualSyncListeners.current.forEach((listener) => {
            try {
              listener();
            } catch (error) {
              console.error('Erro ao notificar listener de sincronização manual', error);
            }
          });
        }
      }
    },
    [isClient, isOffline, refreshPendingMutations]
  );

  useEffect(() => {
    if (!isOffline) {
      void flushQueue();
    }
  }, [isOffline, flushQueue]);

  const onManualSync = useCallback((listener: () => void) => {
    manualSyncListeners.current.add(listener);
    return () => {
      manualSyncListeners.current.delete(listener);
    };
  }, []);

  const pendingActions = useMemo(() => {
    return pendingMutations.map((mutation) => mutation.description);
  }, [pendingMutations]);

  const value = useMemo<OfflineContextValue>(() => ({
    isOffline,
    lastChangedAt,
    pendingActions,
    enqueueTaskUpdate,
    removeTaskUpdate,
    flushQueue,
    onManualSync,
    isSyncing
  }), [
    isOffline,
    lastChangedAt,
    pendingActions,
    enqueueTaskUpdate,
    removeTaskUpdate,
    flushQueue,
    onManualSync,
    isSyncing
  ]);

  return <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>;
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline deve ser usado dentro de OfflineProvider');
  }
  return context;
}
