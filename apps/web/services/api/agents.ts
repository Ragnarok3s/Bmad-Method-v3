'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { CoreApiError, PaginationMeta } from './housekeeping';

const CORE_API_BASE_URL =
  process.env.NEXT_PUBLIC_CORE_API_BASE_URL ?? 'http://localhost:8000';

export type AgentAvailability = 'available' | 'limited' | 'maintenance';

export interface FilterOption<T = string> {
  value: T;
  label: string;
  count: number;
}

export interface AgentCatalogItem {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  role: string;
  competencies: string[];
  availability: AgentAvailability;
  availabilityLabel: string;
  responseTimeMinutes: number | null;
  automationLevel: string | null;
  integrations: string[];
  languages: string[];
}

export interface AgentCatalogFilters {
  competencies: FilterOption[];
  availability: FilterOption<AgentAvailability>[];
}

export interface AgentsCatalogResponse {
  items: AgentCatalogItem[];
  pagination: PaginationMeta;
  availableFilters: AgentCatalogFilters;
}

export interface AgentsCatalogQuery {
  competencies?: string[];
  availability?: AgentAvailability[];
  page?: number;
  pageSize?: number;
  signal?: AbortSignal;
}

interface AgentCatalogItemDto {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  role: string;
  competencies: string[];
  availability: AgentAvailability;
  availability_label: string;
  response_time_minutes: number | null;
  automation_level: string | null;
  integrations: string[];
  languages: string[];
}

interface FilterOptionDto<T = string> {
  value: T;
  label: string;
  count: number;
}

interface AgentCatalogFiltersDto {
  competencies: FilterOptionDto[];
  availability: FilterOptionDto<AgentAvailability>[];
}

interface PaginationMetaDto {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

interface AgentCatalogResponseDto {
  items: AgentCatalogItemDto[];
  pagination: PaginationMetaDto;
  available_filters: AgentCatalogFiltersDto;
}

function mapAgent(dto: AgentCatalogItemDto): AgentCatalogItem {
  return {
    slug: dto.slug,
    name: dto.name,
    tagline: dto.tagline,
    description: dto.description,
    role: dto.role,
    competencies: [...dto.competencies],
    availability: dto.availability,
    availabilityLabel: dto.availability_label,
    responseTimeMinutes: dto.response_time_minutes,
    automationLevel: dto.automation_level,
    integrations: [...dto.integrations],
    languages: [...dto.languages]
  };
}

function mapFilters(dto: AgentCatalogFiltersDto): AgentCatalogFilters {
  return {
    competencies: dto.competencies.map((option) => ({
      value: option.value,
      label: option.label,
      count: option.count
    })),
    availability: dto.availability.map((option) => ({
      value: option.value,
      label: option.label,
      count: option.count
    }))
  };
}

function mapPagination(dto: PaginationMetaDto): PaginationMeta {
  return {
    page: dto.page,
    pageSize: dto.page_size,
    total: dto.total,
    totalPages: dto.total_pages
  };
}

function serializeFilters(filters: AgentsCatalogState): string {
  const normalizedCompetencies = [...filters.competencies]
    .map((value) => value.trim().toLowerCase())
    .sort();
  const normalizedAvailability = [...filters.availability].sort();
  return JSON.stringify({
    page: filters.page,
    pageSize: filters.pageSize,
    competencies: normalizedCompetencies,
    availability: normalizedAvailability
  });
}

function safeReadJson(response: Response): Promise<unknown> {
  return response
    .json()
    .catch(() => null);
}

const catalogCache = new Map<string, AgentsCatalogResponse>();

export async function getAgentsCatalog(
  query: AgentsCatalogQuery = {}
): Promise<AgentsCatalogResponse> {
  const url = new URL('/agents', CORE_API_BASE_URL);
  if (query.page) {
    url.searchParams.set('page', String(query.page));
  }
  if (query.pageSize) {
    url.searchParams.set('page_size', String(query.pageSize));
  }
  query.competencies?.forEach((value) => {
    if (value) {
      url.searchParams.append('competency', value);
    }
  });
  query.availability?.forEach((value) => {
    url.searchParams.append('availability', value);
  });

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
    cache: 'no-store',
    signal: query.signal
  });

  if (!response.ok) {
    const body = await safeReadJson(response);
    throw new CoreApiError('Failed to load agents catalog', response.status, body);
  }

  const payload = (await response.json()) as AgentCatalogResponseDto;
  return {
    items: payload.items.map(mapAgent),
    pagination: mapPagination(payload.pagination),
    availableFilters: mapFilters(payload.available_filters)
  };
}

export interface AgentsCatalogState {
  competencies: string[];
  availability: AgentAvailability[];
  page: number;
  pageSize: number;
}

export interface UseAgentsCatalogOptions {
  pageSize?: number;
  defaultCompetencies?: string[];
  defaultAvailability?: AgentAvailability[];
}

export interface UseAgentsCatalogResult {
  items: AgentCatalogItem[];
  pagination: PaginationMeta | null;
  availableFilters: AgentCatalogFilters;
  filters: AgentsCatalogState;
  loading: boolean;
  error: Error | null;
  setCompetencies: (values: string[]) => void;
  setAvailability: (values: AgentAvailability[]) => void;
  setPage: (page: number) => void;
  refresh: () => void;
}

export function useAgentsCatalog(
  options: UseAgentsCatalogOptions = {}
): UseAgentsCatalogResult {
  const initialState = useMemo<AgentsCatalogState>(
    () => ({
      competencies: options.defaultCompetencies ?? [],
      availability: options.defaultAvailability ?? [],
      page: 1,
      pageSize: options.pageSize ?? 6
    }),
    [options.defaultAvailability, options.defaultCompetencies, options.pageSize]
  );

  const [filters, setFilters] = useState<AgentsCatalogState>(initialState);
  const [data, setData] = useState<AgentsCatalogResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const abortController = useRef<AbortController | null>(null);

  useEffect(() => {
    const key = serializeFilters(filters);
    const cached = catalogCache.get(key);
    if (cached) {
      setData(cached);
      setError(null);
      setLoading(false);
      return;
    }

    abortController.current?.abort();
    const controller = new AbortController();
    abortController.current = controller;

    setLoading(true);
    setError(null);

    getAgentsCatalog({
      page: filters.page,
      pageSize: filters.pageSize,
      competencies: filters.competencies,
      availability: filters.availability,
      signal: controller.signal
    })
      .then((response) => {
        if (controller.signal.aborted) {
          return;
        }
        catalogCache.set(key, response);
        setData(response);
      })
      .catch((apiError: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        if (apiError instanceof Error) {
          setError(apiError);
        } else {
          setError(new Error('Não foi possível carregar o catálogo de agentes.'));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [filters]);

  const setCompetencies = useCallback((values: string[]) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      competencies: Array.from(new Set(values))
    }));
  }, []);

  const setAvailability = useCallback((values: AgentAvailability[]) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      availability: Array.from(new Set(values))
    }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      page: Math.max(1, page)
    }));
  }, []);

  const refresh = useCallback(() => {
    const key = serializeFilters(filters);
    catalogCache.delete(key);
    setFilters((prev) => ({ ...prev }));
  }, [filters]);

  return {
    items: data?.items ?? [],
    pagination: data?.pagination ?? null,
    availableFilters:
      data?.availableFilters ?? { competencies: [], availability: [] },
    filters,
    loading,
    error,
    setCompetencies,
    setAvailability,
    setPage,
    refresh
  };
}
