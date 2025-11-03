'use client';

import { useEffect, useMemo, useState } from 'react';

import { SectionHeader } from '@/components/layout/SectionHeader';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  executePlaybook,
  listPlaybooks,
  PlaybookExecutionResponse,
  PlaybookTemplate
} from '@/services/api/playbooks';
import { CoreApiError } from '@/services/api/housekeeping';

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('pt-PT', {
  dateStyle: 'short',
  timeStyle: 'short'
});

type ExecutionFeedback = {
  status: 'success' | 'error';
  message: string;
  payload?: PlaybookExecutionResponse;
};

export default function PlaybooksPage() {
  const [playbooks, setPlaybooks] = useState<PlaybookTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [executingId, setExecutingId] = useState<number | null>(null);
  const [executionFeedback, setExecutionFeedback] = useState<Record<number, ExecutionFeedback>>({});

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    listPlaybooks(controller.signal)
      .then((templates) => {
        if (controller.signal.aborted) {
          return;
        }
        setPlaybooks(templates);
      })
      .catch((apiError: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        if (apiError instanceof CoreApiError) {
          setError(
            apiError.status >= 500
              ? 'Serviço de playbooks indisponível. Tente novamente em instantes.'
              : 'Não foi possível carregar a biblioteca de playbooks.'
          );
        } else {
          setError('Ocorreu um erro inesperado ao carregar os playbooks.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const tags = useMemo(() => {
    const collected = new Set<string>();
    playbooks.forEach((template) => {
      template.tags.forEach((tag) => collected.add(tag));
    });
    return Array.from(collected).sort((a, b) => a.localeCompare(b));
  }, [playbooks]);

  const filteredPlaybooks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return playbooks.filter((template) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        template.name.toLowerCase().includes(normalizedSearch) ||
        template.summary.toLowerCase().includes(normalizedSearch) ||
        template.steps.some((step) => step.toLowerCase().includes(normalizedSearch));

      const matchesTags =
        activeTags.size === 0 || template.tags.some((tag) => activeTags.has(tag));

      return matchesSearch && matchesTags;
    });
  }, [activeTags, playbooks, search]);

  const handleToggleTag = (tag: string) => {
    setActiveTags((previous) => {
      const next = new Set(previous);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  const handleExecute = async (playbook: PlaybookTemplate) => {
    setExecutingId(playbook.id);
    setExecutionFeedback((current) => {
      const next = { ...current };
      delete next[playbook.id];
      return next;
    });

    try {
      const execution = await executePlaybook(playbook.id, 'web-playbooks');
      setExecutionFeedback((current) => ({
        ...current,
        [playbook.id]: {
          status: 'success',
          message: execution.message,
          payload: execution
        }
      }));
      setPlaybooks((current) =>
        current.map((template) =>
          template.id === playbook.id
            ? {
                ...template,
                executionCount: template.executionCount + 1,
                lastExecutedAt: execution.finishedAt ?? execution.startedAt
              }
            : template
        )
      );
    } catch (apiError: unknown) {
      const message =
        apiError instanceof CoreApiError && apiError.status >= 500
          ? 'Falha ao contactar o orquestrador de playbooks.'
          : 'Não foi possível iniciar a execução. Tente novamente.';
      setExecutionFeedback((current) => ({
        ...current,
        [playbook.id]: { status: 'error', message }
      }));
    } finally {
      setExecutingId(null);
    }
  };

  return (
    <div className="playbooks-page">
      <SectionHeader
        subtitle="Biblioteca inicial alinhada ao roadmap BL-03"
        actions={
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Pesquisar por nome, tag ou etapa"
            aria-label="Pesquisar playbooks"
            data-testid="playbook-search"
          />
        }
      >
        Playbooks automatizados
      </SectionHeader>

      <div className="toolbar" role="group" aria-label="Filtros por tag">
        {tags.map((tag) => {
          const isActive = activeTags.has(tag);
          return (
            <button
              key={tag}
              type="button"
              className={isActive ? 'tag active' : 'tag'}
              onClick={() => handleToggleTag(tag)}
              data-active={isActive}
              data-testid="playbook-tag-filter"
              data-tag={tag}
            >
              #{tag}
            </button>
          );
        })}
        {tags.length === 0 && !loading && (
          <span className="empty-tags">Nenhuma tag cadastrada ainda.</span>
        )}
      </div>

      {error && <p className="error" role="alert">{error}</p>}
      {loading && <p className="loading">A carregar playbooks…</p>}

      <ResponsiveGrid columns={3}>
        {filteredPlaybooks.map((playbook) => {
          const feedback = executionFeedback[playbook.id];
          const hasExecutions = playbook.executionCount > 0;
          const lastRunLabel = hasExecutions
            ? `Última execução ${playbook.lastExecutedAt ? DATE_TIME_FORMATTER.format(new Date(playbook.lastExecutedAt)) : 'não registrada'}`
            : 'Ainda não executado';

          return (
            <Card
              key={playbook.id}
              title={playbook.name}
              description={playbook.summary}
              accent={hasExecutions ? 'success' : undefined}
            >
              <div className="card-header" data-testid="playbook-card" data-playbook-id={playbook.id}>
                <StatusBadge variant={hasExecutions ? 'success' : 'neutral'}>
                  {hasExecutions
                    ? `${playbook.executionCount} execuções registradas`
                    : 'Novo template'}
                </StatusBadge>
                <span className="last-run">{lastRunLabel}</span>
              </div>
              {playbook.tags.length > 0 && (
                <ul className="tags" aria-label={`Tags do playbook ${playbook.name}`}>
                  {playbook.tags.map((tag) => (
                    <li key={tag}>#{tag}</li>
                  ))}
                </ul>
              )}
              <ol className="steps">
                {playbook.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <button
                type="button"
                className="run-button"
                onClick={() => handleExecute(playbook)}
                disabled={executingId === playbook.id}
                data-testid="playbook-run-button"
              >
                {executingId === playbook.id ? 'A iniciar…' : 'Iniciar execução'}
              </button>
              {feedback && (
                <p className={`feedback ${feedback.status}`} data-testid="playbook-feedback">
                  {feedback.message}
                  {feedback.payload && (
                    <span className="run-id"> Referência: {feedback.payload.runId}</span>
                  )}
                </p>
              )}
            </Card>
          );
        })}
        {!loading && filteredPlaybooks.length === 0 && (
          <Card title="Nenhum playbook encontrado">
            <p>Experimente ajustar a pesquisa ou remover filtros de tags.</p>
          </Card>
        )}
      </ResponsiveGrid>

      <style jsx>{`
        .playbooks-page {
          display: grid;
          gap: var(--space-6);
        }
        input[type='search'] {
          min-width: 280px;
          border: 1px solid var(--color-neutral-4);
          border-radius: var(--radius-sm);
          padding: var(--space-2) var(--space-3);
          font-size: 0.95rem;
        }
        .toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-3);
          align-items: center;
        }
        .tag {
          border: 1px solid var(--color-neutral-4);
          border-radius: var(--radius-pill);
          padding: 0 var(--space-3);
          height: 32px;
          background: #fff;
          cursor: pointer;
          font-weight: 600;
        }
        .tag.active,
        .tag[data-active='true'] {
          background: var(--color-deep-blue);
          color: #fff;
          border-color: var(--color-deep-blue);
        }
        .empty-tags {
          color: var(--color-neutral-3);
          font-size: 0.9rem;
        }
        .error {
          color: var(--color-coral);
          font-weight: 600;
        }
        .loading {
          color: var(--color-neutral-2);
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--space-3);
        }
        .last-run {
          font-size: 0.85rem;
          color: var(--color-neutral-3);
        }
        .tags {
          list-style: none;
          display: flex;
          gap: var(--space-2);
          padding: 0;
          margin: 0;
          flex-wrap: wrap;
        }
        .tags li {
          background: rgba(37, 99, 235, 0.08);
          color: var(--color-deep-blue);
          padding: 0 var(--space-2);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 600;
        }
        .steps {
          margin: 0;
          padding-left: var(--space-5);
          display: grid;
          gap: var(--space-2);
        }
        .run-button {
          background: var(--color-deep-blue);
          color: #fff;
          border: none;
          border-radius: var(--radius-sm);
          padding: var(--space-2) var(--space-4);
          font-weight: 600;
          cursor: pointer;
        }
        .run-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .feedback {
          margin: 0;
          font-size: 0.85rem;
        }
        .feedback.success {
          color: var(--color-soft-aqua);
        }
        .feedback.error {
          color: var(--color-coral);
        }
        .run-id {
          display: block;
          margin-top: var(--space-1);
          font-size: 0.75rem;
          color: var(--color-neutral-3);
        }
        @media (max-width: 1024px) {
          input[type='search'] {
            width: 100%;
          }
          .card-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
