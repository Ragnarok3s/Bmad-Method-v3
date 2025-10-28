'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { useAnalytics } from '@/components/analytics/AnalyticsContext';
import {
  fetchKnowledgeBaseCatalog,
  KnowledgeBaseArticleSummary,
  trackKnowledgeBaseEvent
} from '@/services/api/knowledge-base';

const recursos = [
  {
    titulo: 'Base de conhecimento',
    itens: ['Artigos semanais', 'Tutoriais em vídeo', 'FAQs acessíveis']
  },
  {
    titulo: 'Central de tickets',
    itens: ['Acompanhamento de SLA', 'Histórico de incidentes', 'Integração ITSM']
  },
  {
    titulo: 'Chat de suporte',
    itens: ['Escalonamento em tempo real', 'Registo automático de conversas', 'Hand-off pós incidentes']
  }
];

const checklist = [
  'Concluir tour guiado de suporte no onboarding',
  'Validar canais de atendimento com equipas',
  'Registar feedback no painel de NPS interno'
];

export default function SuportePage() {
  const analytics = useAnalytics();
  const [highlights, setHighlights] = useState<KnowledgeBaseArticleSummary[]>([]);
  const [loadingHighlights, setLoadingHighlights] = useState(true);
  const [announcement, setAnnouncement] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadHighlights() {
      try {
        const data = await fetchKnowledgeBaseCatalog({ limit: 3 });
        if (!active) return;
        setHighlights(data.articles);
      } catch (error) {
        if (!active) return;
        setHighlights([]);
      } finally {
        if (active) {
          setLoadingHighlights(false);
        }
      }
    }

    loadHighlights();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!announcement) {
      return;
    }
    const timeout = window.setTimeout(() => setAnnouncement(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [announcement]);

  const handleCopySnippet = async (article: KnowledgeBaseArticleSummary) => {
    if (!article.snippetPreview) {
      return;
    }
    try {
      await navigator.clipboard.writeText(article.snippetPreview);
      analytics.track('knowledge_base.support_snippet_copy', {
        slug: article.slug,
        surface: 'support_center'
      });
      trackKnowledgeBaseEvent({
        event: 'snippet_copy',
        slug: article.slug,
        surface: 'support_center'
      }).catch(() => undefined);
      setAnnouncement('Snippet copiado a partir da base de conhecimento.');
    } catch (error) {
      setAnnouncement('Não foi possível copiar o snippet automaticamente.');
    }
  };

  return (
    <div>
      <SectionHeader subtitle="Centro de suporte completo conforme manual do usuário">
        Base de conhecimento & Ajuda
      </SectionHeader>
      {announcement && (
        <p role="status" aria-live="polite" className="suporte-announcement">
          {announcement}
        </p>
      )}
      <ResponsiveGrid columns={3}>
        {recursos.map((recurso) => (
          <Card key={recurso.titulo} title={recurso.titulo}>
            <ul>
              {recurso.itens.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
        ))}
      </ResponsiveGrid>
      <Card
        title="Snippets rápidos da base de conhecimento"
        description="Sugestões directas para reduzir abertura de tickets"
        accent="info"
      >
        {loadingHighlights && <p>A carregar artigos sugeridos…</p>}
        {!loadingHighlights && highlights.length === 0 && (
          <p>Sem destaques no momento. Aceda à base completa para explorar novos artigos.</p>
        )}
        {!loadingHighlights && highlights.length > 0 && (
          <ul className="suporte-highlights">
            {highlights.map((article) => (
              <li key={article.id}>
                <div>
                  <strong>{article.title}</strong>
                  <p>{article.excerpt}</p>
                  <span className="suporte-meta">
                    {article.categoryName} · {article.readingTimeMinutes} min
                  </span>
                </div>
                {article.snippetPreview && (
                  <pre aria-label={`Snippet sugerido do artigo ${article.title}`}>
                    {article.snippetPreview}
                  </pre>
                )}
                <div className="suporte-highlight-actions">
                  <Link href={`/support/knowledge-base`} className="link">
                    Abrir artigo
                  </Link>
                  {article.snippetPreview && (
                    <button type="button" onClick={() => handleCopySnippet(article)}>
                      Copiar snippet
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Card title="Checklist de lançamento" description="Valide antes do go-live" accent="info">
        <ul>
          {checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <Link href="/support/knowledge-base" className="suporte-link">
          Ver tour completo da base de conhecimento
        </Link>
      </Card>
      <style jsx>{`
        .suporte-announcement {
          background: rgba(46, 196, 182, 0.15);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-sm);
          margin: 0 0 var(--space-3);
        }
        ul {
          margin: 0;
          padding-left: var(--space-5);
          display: grid;
          gap: var(--space-2);
        }
        .suporte-highlights {
          display: grid;
          gap: var(--space-3);
          margin: 0;
          padding-left: 0;
          list-style: none;
        }
        .suporte-highlights li {
          display: grid;
          gap: var(--space-2);
          background: rgba(11, 60, 93, 0.04);
          padding: var(--space-3);
          border-radius: var(--radius-sm);
        }
        .suporte-highlights pre {
          margin: 0;
          background: #fff;
          padding: var(--space-2);
          border-radius: var(--radius-sm);
          white-space: pre-wrap;
        }
        .suporte-highlight-actions {
          display: flex;
          gap: var(--space-2);
          align-items: center;
        }
        .suporte-highlight-actions button {
          border-radius: var(--radius-sm);
          border: none;
          background: var(--color-deep-blue);
          color: #fff;
          padding: var(--space-1) var(--space-3);
          cursor: pointer;
        }
        .suporte-highlights .link {
          font-weight: 600;
          color: var(--color-deep-blue);
        }
        .suporte-meta {
          font-size: 0.875rem;
          color: var(--color-neutral-2);
        }
        .suporte-link {
          display: inline-block;
          margin-top: var(--space-3);
          font-weight: 600;
          color: var(--color-deep-blue);
        }
      `}</style>
    </div>
  );
}
