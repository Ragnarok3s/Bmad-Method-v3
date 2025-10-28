'use client';

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';

import { SectionHeader } from '@/components/layout/SectionHeader';
import { Card } from '@/components/ui/Card';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { useAnalytics } from '@/components/analytics/AnalyticsContext';
import { usePageTour } from '@/components/tour/usePageTour';
import {
  fetchKnowledgeBaseArticle,
  fetchKnowledgeBaseCatalog,
  KnowledgeBaseArticle,
  KnowledgeBaseArticleSummary,
  KnowledgeBaseCatalog,
  KnowledgeBaseSnippet,
  trackKnowledgeBaseEvent
} from '@/services/api/knowledge-base';

export default function KnowledgeBasePage() {
  const analytics = useAnalytics();
  const [catalog, setCatalog] = useState<KnowledgeBaseCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ query: string | null; category: string | null }>({
    query: null,
    category: null
  });
  const [searchInput, setSearchInput] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeBaseArticle | null>(null);
  const [articleLoading, setArticleLoading] = useState(false);
  const [articleError, setArticleError] = useState<string | null>(null);
  const [articleCompleted, setArticleCompleted] = useState(false);
  const [announcement, setAnnouncement] = useState<string | null>(null);

  const tourSteps = useMemo(
    () => [
      {
        id: 'kb-search',
        title: 'Pesquisa inteligente',
        description: 'Procure por categoria, incidente ou playbook para acelerar o autoatendimento.',
        target: '[data-tour="kb-search"]'
      },
      {
        id: 'kb-categories',
        title: 'Categorias prioritárias',
        description: 'Filtre artigos por Primeiros Passos, Incidentes ou Automações conforme o cenário operacional.',
        target: '[data-tour="kb-categories"]'
      },
      {
        id: 'kb-results',
        title: 'Resultados com snippet automático',
        description: 'Cada artigo oferece um snippet pronto para partilha imediata com a equipa.',
        target: '[data-tour="kb-results"]'
      },
      {
        id: 'kb-article',
        title: 'Telemetria de leitura e snippets',
        description: 'Dentro do artigo copie snippets, marque leitura concluída e envie telemetria para o dashboard.',
        target: '[data-tour="kb-article"]'
      }
    ],
    []
  );

  usePageTour({
    id: 'support-knowledge-base',
    title: 'Tour do centro de suporte',
    description: 'Conheça pesquisa, categorias e snippets que alimentam o autoatendimento.',
    steps: tourSteps,
    autoStart: true,
    route: ['/support/knowledge-base']
  });

  useEffect(() => {
    let active = true;
    async function loadCatalog(query: string | null, category: string | null) {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchKnowledgeBaseCatalog({ query, category, limit: 12 });
        if (!active) return;
        setCatalog(data);
        if (query) {
          analytics.track('knowledge_base.search_performed', {
            query,
            category: category ?? 'all',
            hits: data.query.totalHits
          });
          trackKnowledgeBaseEvent({
            event: 'search',
            query,
            hits: data.query.totalHits,
            surface: 'support_center'
          }).catch(() => {
            // ignore telemetry network errors
          });
        }
      } catch (err) {
        if (!active) return;
        setCatalog(null);
        setError('Não foi possível carregar a base de conhecimento.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCatalog(filters.query, filters.category);
    return () => {
      active = false;
    };
  }, [analytics, filters]);

  useEffect(() => {
    if (!announcement) {
      return;
    }
    const timeout = window.setTimeout(() => setAnnouncement(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [announcement]);

  const handleSearchSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmed = searchInput.trim();
      setFilters((current) => ({ ...current, query: trimmed.length > 0 ? trimmed : null }));
    },
    [searchInput]
  );

  const toggleCategory = (categoryId: string) => {
    setFilters((current) => ({
      query: current.query,
      category: current.category === categoryId ? null : categoryId
    }));
  };

  const openArticle = async (summary: KnowledgeBaseArticleSummary) => {
    setArticleLoading(true);
    setArticleError(null);
    setAnnouncement(null);
    try {
      const article = await fetchKnowledgeBaseArticle(summary.slug);
      setSelectedArticle(article);
      setArticleCompleted(false);
      analytics.track('knowledge_base.article_view', {
        slug: article.slug,
        category: article.categoryId
      });
      trackKnowledgeBaseEvent({
        event: 'article_view',
        slug: article.slug,
        surface: 'support_center'
      }).catch(() => undefined);
    } catch (err) {
      setArticleError('Não foi possível carregar o artigo seleccionado.');
      setSelectedArticle(null);
    } finally {
      setArticleLoading(false);
    }
  };

  const closeArticle = () => {
    setSelectedArticle(null);
    setArticleCompleted(false);
    setArticleError(null);
  };

  const markArticleCompleted = () => {
    if (!selectedArticle || articleCompleted) {
      return;
    }
    setArticleCompleted(true);
    analytics.track('knowledge_base.article_complete', {
      slug: selectedArticle.slug,
      category: selectedArticle.categoryId
    });
    trackKnowledgeBaseEvent({
      event: 'article_complete',
      slug: selectedArticle.slug,
      surface: 'support_center',
      durationSeconds: selectedArticle.readingTimeMinutes * 60
    }).catch(() => undefined);
    setAnnouncement('Leitura marcada como concluída.');
  };

  const copySnippet = async (snippet: KnowledgeBaseSnippet, article: KnowledgeBaseArticle) => {
    try {
      await navigator.clipboard.writeText(snippet.content);
      setAnnouncement('Snippet copiado para a área de transferência.');
      analytics.track('knowledge_base.snippet_copy', {
        article: article.slug,
        surface: snippet.surface
      });
      trackKnowledgeBaseEvent({
        event: 'snippet_copy',
        slug: article.slug,
        surface: snippet.surface
      }).catch(() => undefined);
    } catch (err) {
      setAnnouncement('Não foi possível copiar o snippet automaticamente.');
    }
  };

  return (
    <div className="kb-page">
      <SectionHeader subtitle="Autoatendimento com snippets e telemetria integrada">
        Base de conhecimento & Suporte
      </SectionHeader>

      <div className="kb-actions" data-tour="kb-search">
        <form onSubmit={handleSearchSubmit} className="kb-search-form">
          <label htmlFor="kb-search">Pesquisar artigos</label>
          <div className="kb-search-input">
            <input
              id="kb-search"
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Ex.: incidentes P1, automações de turno"
              aria-describedby="kb-search-help"
            />
            <button type="submit">Pesquisar</button>
          </div>
          <p id="kb-search-help" className="kb-help-text">
            Pesquise por incidentes, categorias ou playbooks para sugerir autoatendimento.
          </p>
        </form>
        <Link className="kb-support-link" href="/suporte">
          Voltar para o centro de suporte
        </Link>
      </div>

      <div className="kb-categories" data-tour="kb-categories">
        <span className="kb-categories-label">Categorias</span>
        <div className="kb-categories-list">
          {(catalog?.categories ?? []).map((category) => {
            const isActive = filters.category === category.id;
            return (
              <button
                key={category.id}
                type="button"
                className={isActive ? 'active' : ''}
                onClick={() => toggleCategory(category.id)}
                aria-pressed={isActive}
              >
                {category.name}
                <span className="badge">{category.totalArticles}</span>
              </button>
            );
          })}
        </div>
      </div>

      {announcement && (
        <p className="kb-announcement" role="status" aria-live="polite">
          {announcement}
        </p>
      )}

      {error && <p role="alert" className="kb-error">{error}</p>}

      <div className="kb-results" data-tour="kb-results">
        {loading && <p className="kb-loading">A carregar artigos…</p>}
        {!loading && catalog && catalog.articles.length === 0 && (
          <Card title="Sem resultados" description="Tente outra combinação de termos ou categoria." />
        )}
        {!loading && catalog && catalog.articles.length > 0 && (
          <ResponsiveGrid columns={2}>
            {catalog.articles.map((article) => (
              <article key={article.id} className="kb-result">
                <header>
                  <h3>{article.title}</h3>
                  <p className="kb-result-meta">
                    {article.categoryName} · {article.readingTimeMinutes} min · {article.stage}
                  </p>
                </header>
                <p>{article.excerpt}</p>
                {article.snippetPreview && (
                  <pre className="kb-snippet" aria-label="Snippet sugerido">
                    {article.snippetPreview}
                  </pre>
                )}
                <div className="kb-result-actions">
                  <button type="button" onClick={() => openArticle(article)}>
                    Ler artigo completo
                  </button>
                  {article.snippetPreview && (
                    <button
                      type="button"
                      className="secondary"
                      onClick={() =>
                        copySnippet(
                          {
                            id: `${article.id}-preview`,
                            label: 'Snippet rápido',
                            content: article.snippetPreview,
                            surface: 'support_center',
                            recommendedPlaybook: null
                          },
                          {
                            ...article,
                            content: '',
                            actionSnippets: [],
                            relatedPlaybooks: [],
                            persona: null,
                            useCase: null
                          }
                        )
                      }
                    >
                      Copiar snippet
                    </button>
                  )}
                </div>
              </article>
            ))}
          </ResponsiveGrid>
        )}
      </div>

      {selectedArticle && (
        <KnowledgeBaseArticleDialog
          article={selectedArticle}
          onClose={closeArticle}
          onCopySnippet={copySnippet}
          onMarkCompleted={markArticleCompleted}
          completed={articleCompleted}
          loading={articleLoading}
          error={articleError}
        />
      )}
      <style jsx>{`
        .kb-page {
          display: grid;
          gap: var(--space-5);
        }
        .kb-actions {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: var(--space-4);
        }
        .kb-search-form {
          display: grid;
          gap: var(--space-2);
        }
        .kb-search-input {
          display: flex;
          gap: var(--space-2);
        }
        input[type='search'] {
          flex: 1;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-neutral-4);
          padding: var(--space-2);
        }
        .kb-search-form button {
          border-radius: var(--radius-sm);
          background: var(--color-deep-blue);
          color: #fff;
          border: none;
          padding: var(--space-2) var(--space-4);
          cursor: pointer;
          font-weight: 600;
        }
        .kb-support-link {
          align-self: center;
          font-weight: 600;
          color: var(--color-deep-blue);
        }
        .kb-help-text {
          margin: 0;
          font-size: 0.875rem;
          color: var(--color-neutral-2);
        }
        .kb-categories {
          display: grid;
          gap: var(--space-2);
        }
        .kb-categories-label {
          font-weight: 600;
          color: var(--color-deep-blue);
        }
        .kb-categories-list {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }
        .kb-categories-list button {
          border-radius: var(--radius-pill);
          border: 1px solid var(--color-neutral-4);
          background: #fff;
          padding: var(--space-1) var(--space-3);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
        }
        .kb-categories-list button.active {
          background: var(--color-deep-blue);
          color: #fff;
          border-color: var(--color-deep-blue);
        }
        .badge {
          font-size: 0.75rem;
          padding: 0 var(--space-1);
          border-radius: var(--radius-pill);
          background: rgba(46, 196, 182, 0.2);
        }
        .kb-announcement {
          margin: 0;
          padding: var(--space-2);
          background: rgba(46, 196, 182, 0.16);
          border-radius: var(--radius-sm);
        }
        .kb-error {
          color: var(--color-coral);
        }
        .kb-results {
          display: grid;
          gap: var(--space-4);
        }
        .kb-loading {
          margin: 0;
        }
        .kb-result {
          display: grid;
          gap: var(--space-3);
          background: #fff;
          border-radius: var(--radius-md);
          padding: var(--space-4);
          box-shadow: var(--shadow-card);
        }
        .kb-result h3 {
          margin: 0;
          color: var(--color-deep-blue);
        }
        .kb-result-meta {
          margin: 0;
          font-size: 0.875rem;
          color: var(--color-neutral-2);
        }
        .kb-snippet {
          background: rgba(11, 60, 93, 0.05);
          padding: var(--space-3);
          border-radius: var(--radius-sm);
          margin: 0;
          white-space: pre-wrap;
        }
        .kb-result-actions {
          display: flex;
          gap: var(--space-3);
        }
        .kb-result-actions button {
          border-radius: var(--radius-sm);
          border: none;
          padding: var(--space-2) var(--space-3);
          cursor: pointer;
          font-weight: 600;
          background: var(--color-deep-blue);
          color: #fff;
        }
        .kb-result-actions button.secondary {
          background: rgba(11, 60, 93, 0.12);
          color: var(--color-deep-blue);
        }
        @media (max-width: 960px) {
          .kb-actions {
            flex-direction: column;
            align-items: stretch;
          }
          .kb-result-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

interface ArticleDialogProps {
  article: KnowledgeBaseArticle;
  onClose: () => void;
  onCopySnippet: (snippet: KnowledgeBaseSnippet, article: KnowledgeBaseArticle) => void;
  onMarkCompleted: () => void;
  completed: boolean;
  loading: boolean;
  error: string | null;
}

function KnowledgeBaseArticleDialog({
  article,
  onClose,
  onCopySnippet,
  onMarkCompleted,
  completed,
  loading,
  error
}: ArticleDialogProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="kb-dialog" role="dialog" aria-modal="true" data-tour="kb-article">
      <div className="kb-dialog-content">
        <header>
          <h2>{article.title}</h2>
          <p className="kb-dialog-meta">
            {article.categoryName} · {article.readingTimeMinutes} min
          </p>
        </header>
        {loading && <p>A carregar artigo…</p>}
        {error && <p role="alert">{error}</p>}
        {!loading && !error && (
          <div className="kb-dialog-body">
            {article.content.split('\n\n').map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {article.actionSnippets.length > 0 && (
              <section className="kb-dialog-snippets">
                <h3>Snippets recomendados</h3>
                {article.actionSnippets.map((snippet) => (
                  <article key={snippet.id} className="kb-dialog-snippet">
                    <header>
                      <h4>{snippet.label}</h4>
                      {snippet.recommendedPlaybook && (
                        <span className="kb-dialog-pill">{snippet.recommendedPlaybook}</span>
                      )}
                    </header>
                    <pre>{snippet.content}</pre>
                    <button type="button" onClick={() => onCopySnippet(snippet, article)}>
                      Copiar snippet
                    </button>
                  </article>
                ))}
              </section>
            )}
          </div>
        )}
        <footer className="kb-dialog-footer">
          <button type="button" className="secondary" onClick={onClose}>
            Fechar
          </button>
          <button type="button" onClick={onMarkCompleted} disabled={completed}>
            {completed ? 'Leitura concluída' : 'Marcar como concluído'}
          </button>
        </footer>
      </div>
      <style jsx>{`
        .kb-dialog {
          position: fixed;
          inset: 0;
          background: rgba(11, 60, 93, 0.6);
          display: grid;
          place-items: center;
          padding: var(--space-6);
          z-index: 2100;
        }
        .kb-dialog-content {
          background: #fff;
          border-radius: var(--radius-md);
          max-width: 720px;
          width: 100%;
          padding: var(--space-5);
          display: grid;
          gap: var(--space-4);
          max-height: 90vh;
          overflow-y: auto;
        }
        .kb-dialog-meta {
          margin: 0;
          font-size: 0.875rem;
          color: var(--color-neutral-2);
        }
        .kb-dialog-body {
          display: grid;
          gap: var(--space-3);
        }
        .kb-dialog-snippets {
          display: grid;
          gap: var(--space-3);
        }
        .kb-dialog-snippet {
          background: rgba(11, 60, 93, 0.04);
          border-radius: var(--radius-sm);
          padding: var(--space-3);
          display: grid;
          gap: var(--space-2);
        }
        .kb-dialog-snippet pre {
          margin: 0;
          white-space: pre-wrap;
        }
        .kb-dialog-snippet button {
          justify-self: start;
          border-radius: var(--radius-sm);
          background: var(--color-deep-blue);
          color: #fff;
          border: none;
          padding: var(--space-1) var(--space-3);
          cursor: pointer;
        }
        .kb-dialog-pill {
          background: rgba(46, 196, 182, 0.2);
          border-radius: var(--radius-pill);
          padding: 0 var(--space-2);
          font-size: 0.75rem;
        }
        .kb-dialog-footer {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-3);
        }
        .kb-dialog-footer button {
          border-radius: var(--radius-sm);
          border: none;
          padding: var(--space-2) var(--space-4);
          cursor: pointer;
          font-weight: 600;
          background: var(--color-deep-blue);
          color: #fff;
        }
        .kb-dialog-footer .secondary {
          background: rgba(11, 60, 93, 0.12);
          color: var(--color-deep-blue);
        }
        .kb-dialog-footer button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        @media (max-width: 768px) {
          .kb-dialog {
            padding: var(--space-4);
          }
          .kb-dialog-content {
            padding: var(--space-4);
          }
        }
      `}</style>
    </div>
  );
}
