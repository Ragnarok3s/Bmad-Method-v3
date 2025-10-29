import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import type { IncidentReportPayload, IncidentSeverity } from '@bmad/api-client';

import { useApiClient } from '../providers/ApiProvider';
import { IncidentRepository, type IncidentQueueItem } from '../modules/incidents/repository';

const DEFAULT_OWNER_ID = 1;

export function IncidentsScreen(): JSX.Element {
  const api = useApiClient();
  const repository = useMemo(() => new IncidentRepository(api), [api]);
  const [incident, setIncident] = useState('');
  const [severity, setSeverity] = useState<IncidentSeverity>('medium');
  const [reportedBy, setReportedBy] = useState('mobile-app');
  const [queue, setQueue] = useState<IncidentQueueItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const loadQueue = useCallback(async () => {
    const items = await repository.listQueue(DEFAULT_OWNER_ID);
    setQueue(items);
  }, [repository]);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  const handleSubmit = useCallback(async () => {
    if (!incident.trim()) {
      Alert.alert('Validação', 'Descreva o incidente antes de enviar.');
      return;
    }
    setSubmitting(true);
    const payload: IncidentReportPayload = {
      incident: incident.trim(),
      severity,
      reportedBy
    };
    try {
      const saved = await repository.submit(DEFAULT_OWNER_ID, payload);
      setQueue((items) => [saved, ...items.filter((item) => item.id !== saved.id)]);
      setIncident('');
    } catch (error) {
      console.warn('incident_submit_failed', error);
      Alert.alert('Erro', 'Não foi possível enviar o incidente agora. Ele permanecerá na fila.');
    } finally {
      setSubmitting(false);
    }
  }, [incident, reportedBy, repository, severity]);

  const retryFailed = useCallback(async () => {
    try {
      await repository.retryPending(DEFAULT_OWNER_ID);
      await loadQueue();
      Alert.alert('Sincronização concluída', 'Incidentes sincronizados com o servidor.');
    } catch (error) {
      console.warn('incident_retry_failed', error);
      Alert.alert('Erro', 'Não foi possível sincronizar as pendências.');
    }
  }, [loadQueue, repository]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Reportar incidente</Text>
      <TextInput
        style={styles.input}
        placeholder="Descreva o incidente"
        multiline
        value={incident}
        onChangeText={setIncident}
      />
      <Text style={styles.label}>Gravidade</Text>
      <View style={styles.severityRow}>
        {(['low', 'medium', 'high'] as IncidentSeverity[]).map((level) => (
          <Text
            key={level}
            onPress={() => setSeverity(level)}
            style={[styles.severityOption, severity === level && styles.severitySelected]}
          >
            {translateSeverity(level)}
          </Text>
        ))}
      </View>
      <Text style={styles.label}>Reportado por</Text>
      <TextInput style={styles.input} value={reportedBy} onChangeText={setReportedBy} />
      <Button title={submitting ? 'Enviando...' : 'Enviar incidente'} onPress={handleSubmit} disabled={submitting} />
      <View style={styles.sectionHeader}>
        <Text style={styles.heading}>Fila local</Text>
        <Button title="Sincronizar pendentes" onPress={retryFailed} />
      </View>
      <FlatList
        data={queue}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <IncidentItem item={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum incidente registado.</Text>}
      />
    </View>
  );
}

function IncidentItem({ item }: { item: IncidentQueueItem }): JSX.Element {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{translateSeverity(item.severity)}</Text>
      <Text style={styles.cardMessage}>{item.incident}</Text>
      <Text style={styles.cardMeta}>Estado: {translateStatus(item.status)}</Text>
      {item.lastError ? <Text style={styles.cardError}>{item.lastError}</Text> : null}
    </View>
  );
}

function translateStatus(status: IncidentQueueItem['status']): string {
  switch (status) {
    case 'pending':
      return 'Pendente';
    case 'synced':
      return 'Sincronizado';
    case 'failed':
      return 'Falhou';
    default:
      return status;
  }
}

function translateSeverity(severity: IncidentSeverity): string {
  switch (severity) {
    case 'low':
      return 'Baixa';
    case 'medium':
      return 'Média';
    case 'high':
      return 'Alta';
    default:
      return severity;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fafb'
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
    fontWeight: '500'
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    minHeight: 48
  },
  severityRow: {
    flexDirection: 'row',
    gap: 8
  },
  severityOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#e5e7eb'
  },
  severitySelected: {
    backgroundColor: '#2563eb',
    color: '#ffffff'
  },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  list: {
    gap: 12,
    paddingBottom: 32
  },
  empty: {
    textAlign: 'center',
    marginTop: 32,
    color: '#6b7280'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    gap: 6
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600'
  },
  cardMessage: {
    fontSize: 14,
    color: '#1f2937'
  },
  cardMeta: {
    fontSize: 12,
    color: '#6b7280'
  },
  cardError: {
    fontSize: 12,
    color: '#dc2626'
  }
});
