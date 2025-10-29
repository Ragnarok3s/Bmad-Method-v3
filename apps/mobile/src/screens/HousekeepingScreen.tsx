import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { HousekeepingTask, HousekeepingStatus } from '@bmad/api-client';

import { useApiClient } from '../providers/ApiProvider';
import { HousekeepingRepository } from '../modules/housekeeping/repository';

const DEFAULT_PROPERTY_ID = 1;
const PAGE_SIZE = 25;

export function HousekeepingScreen(): JSX.Element {
  const api = useApiClient();
  const repository = useMemo(() => new HousekeepingRepository(api), [api]);
  const [tasks, setTasks] = useState<HousekeepingTask[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCached = useCallback(async () => {
    const cached = await repository.listCached(DEFAULT_PROPERTY_ID);
    setTasks(cached);
    const synced = await repository.getLastSync(DEFAULT_PROPERTY_ID);
    setLastSync(synced);
  }, [repository]);

  const syncRemote = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await repository.sync(DEFAULT_PROPERTY_ID, { pageSize: PAGE_SIZE });
      setTasks(response.items);
      setLastSync(new Date());
    } catch (error) {
      console.warn('housekeeping_sync_failed', error);
      Alert.alert('Sincronização falhou', 'Não foi possível atualizar as tarefas agora.');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [repository]);

  useEffect(() => {
    loadCached().finally(() => {
      syncRemote().catch(() => undefined);
    });
  }, [loadCached, syncRemote]);

  const handleToggle = useCallback(
    async (task: HousekeepingTask) => {
      const nextStatus: HousekeepingStatus = task.status === 'completed' ? 'pending' : 'completed';
      try {
        const updated = await repository.updateTask(task.id, { status: nextStatus });
        setTasks((items) =>
          items.map((current) => (current.id === updated.id ? { ...current, status: updated.status } : current))
        );
      } catch (error) {
        console.warn('housekeeping_update_failed', error);
        Alert.alert('Erro', 'Não foi possível atualizar a tarefa agora.');
      }
    },
    [repository]
  );

  const renderItem = useCallback(
    ({ item }: { item: HousekeepingTask }) => {
      return (
        <View style={styles.card}>
          <Text style={styles.title}>Tarefa #{item.id}</Text>
          <Text style={styles.subtitle}>Reserva: {item.reservationId ?? '—'}</Text>
          <Text style={styles.subtitle}>Estado: {translateStatus(item.status)}</Text>
          <Text style={styles.notes}>{item.notes ?? 'Sem notas adicionais.'}</Text>
          <TouchableOpacity style={styles.button} onPress={() => handleToggle(item)}>
            <Text style={styles.buttonText}>
              {item.status === 'completed' ? 'Reabrir tarefa' : 'Marcar como concluída'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    },
    [handleToggle]
  );

  const listHeader = useMemo(() => {
    if (!lastSync) {
      return null;
    }
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>Última sincronização: {lastSync.toLocaleString()}</Text>
      </View>
    );
  }, [lastSync]);

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={!loading ? <Text style={styles.emptyText}>Nenhuma tarefa encontrada.</Text> : null}
        ListHeaderComponent={listHeader}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={syncRemote} />}
      />
    </View>
  );
}

function translateStatus(status: HousekeepingStatus): string {
  switch (status) {
    case 'pending':
      return 'Pendente';
    case 'in_progress':
      return 'Em progresso';
    case 'completed':
      return 'Concluída';
    case 'blocked':
      return 'Bloqueada';
    default:
      return status;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7'
  },
  listContainer: {
    padding: 16,
    gap: 12
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    gap: 8
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a'
  },
  subtitle: {
    fontSize: 14,
    color: '#4a4a4a'
  },
  notes: {
    fontSize: 14,
    color: '#2d2d2d'
  },
  button: {
    marginTop: 8,
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600'
  },
  header: {
    paddingVertical: 8
  },
  headerText: {
    fontSize: 12,
    color: '#6b7280'
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 48,
    fontSize: 16,
    color: '#6b7280'
  }
});
