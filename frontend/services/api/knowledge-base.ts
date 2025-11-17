const CORE_API_BASE_URL =
  process.env.NEXT_PUBLIC_CORE_API_BASE_URL ?? 'http://localhost:8000';

interface KnowledgeBaseCategoryDto {
  id: string;
  name: string;
  description: string;
  total_articles: number;
  top_tags: string[];
}

interface KnowledgeBaseArticleSummaryDto {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category_id: string;
  category_name: string;
  reading_time_minutes: number;
  tags: string[];
  updated_at: string;
  stage: string;
  snippet_preview: string | null;
}

interface KnowledgeBaseSnippetDto {
  id: string;
  label: string;
  content: string;
  surface: string;
  recommended_playbook: string | null;
}

interface KnowledgeBaseArticleDto extends KnowledgeBaseArticleSummaryDto {
  content: string;
  action_snippets: KnowledgeBaseSnippetDto[];
  related_playbooks: string[];
  persona: string | null;
  use_case: string | null;
}

interface KnowledgeBaseCatalogDto {
  categories: KnowledgeBaseCategoryDto[];
  articles: KnowledgeBaseArticleSummaryDto[];
  query: {
    term: string | null;
    total_hits: number;
  };
}

export interface KnowledgeBaseCategory {
  id: string;
  name: string;
  description: string;
  totalArticles: number;
  topTags: string[];
}

export interface KnowledgeBaseArticleSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  categoryId: string;
  categoryName: string;
  readingTimeMinutes: number;
  tags: string[];
  updatedAt: string;
  stage: string;
  snippetPreview: string | null;
}

export interface KnowledgeBaseSnippet {
  id: string;
  label: string;
  content: string;
  surface: string;
  recommendedPlaybook: string | null;
}

export interface KnowledgeBaseArticle extends KnowledgeBaseArticleSummary {
  content: string;
  actionSnippets: KnowledgeBaseSnippet[];
  relatedPlaybooks: string[];
  persona: string | null;
  useCase: string | null;
}

export interface KnowledgeBaseCatalog {
  categories: KnowledgeBaseCategory[];
  articles: KnowledgeBaseArticleSummary[];
  query: {
    term: string | null;
    totalHits: number;
  };
}

export interface KnowledgeBaseTelemetryEvent {
  event: 'search' | 'article_view' | 'article_complete' | 'snippet_copy';
  slug?: string;
  query?: string;
  hits?: number;
  surface?: string;
  durationSeconds?: number;
}

export async function fetchKnowledgeBaseCatalog(
  params: { query?: string | null; category?: string | null; limit?: number } = {}
): Promise<KnowledgeBaseCatalog> {
  const url = new URL('/support/knowledge-base/catalog', CORE_API_BASE_URL);
  if (params.query) {
    url.searchParams.set('q', params.query);
  }
  if (params.category) {
    url.searchParams.set('category', params.category);
  }
  if (params.limit) {
    url.searchParams.set('limit', params.limit.toString());
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`Failed to load knowledge base catalog: ${response.status}`);
  }

  const dto = (await response.json()) as KnowledgeBaseCatalogDto;
  return {
    categories: dto.categories.map(mapCategory),
    articles: dto.articles.map(mapArticleSummary),
    query: {
      term: dto.query.term,
      totalHits: dto.query.total_hits
    }
  };
}

export async function fetchKnowledgeBaseArticle(slug: string): Promise<KnowledgeBaseArticle> {
  const url = new URL(`/support/knowledge-base/articles/${slug}`, CORE_API_BASE_URL);
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`Failed to load article ${slug}: ${response.status}`);
  }

  const dto = (await response.json()) as KnowledgeBaseArticleDto;
  return mapArticle(dto);
}

export async function trackKnowledgeBaseEvent(event: KnowledgeBaseTelemetryEvent): Promise<void> {
  const url = new URL('/support/knowledge-base/telemetry', CORE_API_BASE_URL);
  const payload: Record<string, unknown> = {
    event: event.event,
    slug: event.slug ?? null,
    query: event.query ?? null,
    hits: event.hits ?? null,
    surface: event.surface ?? null,
    duration_seconds: event.durationSeconds ?? null
  };

  await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
}

function mapCategory(dto: KnowledgeBaseCategoryDto): KnowledgeBaseCategory {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    totalArticles: dto.total_articles,
    topTags: dto.top_tags
  };
}

function mapArticleSummary(dto: KnowledgeBaseArticleSummaryDto): KnowledgeBaseArticleSummary {
  return {
    id: dto.id,
    slug: dto.slug,
    title: dto.title,
    excerpt: dto.excerpt,
    categoryId: dto.category_id,
    categoryName: dto.category_name,
    readingTimeMinutes: dto.reading_time_minutes,
    tags: dto.tags,
    updatedAt: dto.updated_at,
    stage: dto.stage,
    snippetPreview: dto.snippet_preview
  };
}

function mapArticle(dto: KnowledgeBaseArticleDto): KnowledgeBaseArticle {
  return {
    ...mapArticleSummary(dto),
    content: dto.content,
    actionSnippets: dto.action_snippets.map((snippet) => ({
      id: snippet.id,
      label: snippet.label,
      content: snippet.content,
      surface: snippet.surface,
      recommendedPlaybook: snippet.recommended_playbook
    })),
    relatedPlaybooks: dto.related_playbooks,
    persona: dto.persona,
    useCase: dto.use_case
  };
}
