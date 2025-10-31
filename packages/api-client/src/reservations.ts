import type { PaginationMeta } from './housekeeping.js';
import { CoreApiClient } from './core.js';

export type ReservationStatus =
  | 'draft'
  | 'confirmed'
  | 'cancelled'
  | 'checked_in'
  | 'checked_out';

export type PaymentIntentStatus = 'preauthorized' | 'captured' | 'cancelled' | 'failed';

export type PaymentProvider = 'stripe' | 'adyen';

export type PaymentMethodStatus = 'active' | 'revoked';

export type InvoiceStatus = 'issued' | 'sent' | 'paid' | 'void';

export interface PaymentIntentRead {
  id: number;
  status: PaymentIntentStatus;
  amountMinor: number;
  currencyCode: string;
  provider: PaymentProvider;
  providerReference: string | null;
  captureOnCheckIn: boolean;
  paymentMethodStatus: PaymentMethodStatus | null;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceRead {
  id: number;
  status: InvoiceStatus;
  amountMinor: number;
  currencyCode: string;
  issuedAt: string;
  dueAt: string | null;
}

export interface ReservationRead {
  id: number;
  propertyId: number;
  guestName: string;
  guestEmail: string;
  status: ReservationStatus;
  checkIn: string;
  checkOut: string;
  totalAmountMinor: number | null;
  currencyCode: string | null;
  captureOnCheckIn: boolean;
  createdAt: string;
  paymentIntents: PaymentIntentRead[] | null;
  invoices: InvoiceRead[] | null;
}

export interface ReservationUpdateStatusPayload {
  status: ReservationStatus;
}

export interface ReservationListQuery {
  propertyId: number;
  status?: ReservationStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
  signal?: AbortSignal;
}

export interface ReservationListResponse {
  items: ReservationRead[];
  pagination: PaginationMeta;
}

interface ReservationDto {
  id: number;
  property_id: number;
  guest_name: string;
  guest_email: string;
  status: ReservationStatus;
  check_in: string;
  check_out: string;
  total_amount_minor: number | null;
  currency_code: string | null;
  capture_on_check_in: boolean;
  created_at: string;
  payment_intents: PaymentIntentDto[] | null;
  invoices: InvoiceDto[] | null;
}

interface PaymentIntentDto {
  id: number;
  status: PaymentIntentStatus;
  amount_minor: number;
  currency_code: string;
  provider: PaymentProvider;
  provider_reference: string | null;
  capture_on_check_in: boolean;
  payment_method_status: PaymentMethodStatus | null;
  created_at: string;
  updated_at: string;
}

interface InvoiceDto {
  id: number;
  status: InvoiceStatus;
  amount_minor: number;
  currency_code: string;
  issued_at: string;
  due_at: string | null;
}

interface ReservationListDto {
  items?: ReservationDto[];
  data?: ReservationDto[];
  pagination?: PaginationMetaDto;
  total?: number;
}

interface PaginationMetaDto {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export class ReservationApi {
  constructor(private readonly client: CoreApiClient) {}

  async listReservations(query: ReservationListQuery): Promise<ReservationListResponse> {
    const { propertyId, signal, ...filters } = query;
    const payload = await this.client.request<ReservationDto[] | ReservationListDto>({
      path: `/properties/${propertyId}/reservations`,
      method: 'GET',
      query: filters,
      signal
    });

    const normalized = normalizeReservationList(payload, query);

    return {
      items: normalized.items.map(mapReservationDto),
      pagination: normalized.pagination
    };
  }

  async updateReservationStatus(
    reservationId: number,
    payload: ReservationUpdateStatusPayload
  ): Promise<ReservationRead> {
    const dto = await this.client.request<ReservationDto>({
      path: `/reservations/${reservationId}`,
      method: 'PATCH',
      body: payload as unknown as Record<string, unknown>
    });
    return mapReservationDto(dto);
  }
}

function normalizeReservationList(
  payload: ReservationDto[] | ReservationListDto,
  query: ReservationListQuery
): { items: ReservationDto[]; pagination: PaginationMeta } {
  if (Array.isArray(payload)) {
    return {
      items: payload,
      pagination: createPagination(payload.length, query.page, query.pageSize)
    };
  }

  const items = payload.items ?? payload.data ?? [];
  if (payload.pagination) {
    return {
      items,
      pagination: mapPagination(payload.pagination)
    };
  }

  const total = payload.total ?? items.length;
  return {
    items,
    pagination: createPagination(total, query.page, query.pageSize, items.length)
  };
}

function createPagination(
  total: number,
  page?: number,
  pageSize?: number,
  fallbackLength?: number
): PaginationMeta {
  const resolvedPageSize = Math.max(pageSize ?? fallbackLength ?? total ?? 1, 1);
  const resolvedTotal = Math.max(total, fallbackLength ?? total ?? 0);
  const totalPages = Math.max(Math.ceil(resolvedTotal / resolvedPageSize), 1);
  const resolvedPage = Math.min(Math.max(page ?? 1, 1), totalPages);
  return {
    page: resolvedPage,
    pageSize: resolvedPageSize,
    total: resolvedTotal,
    totalPages
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

export function mapReservationDto(dto: ReservationDto): ReservationRead {
  return {
    id: dto.id,
    propertyId: dto.property_id,
    guestName: dto.guest_name,
    guestEmail: dto.guest_email,
    status: dto.status,
    checkIn: dto.check_in,
    checkOut: dto.check_out,
    totalAmountMinor: dto.total_amount_minor,
    currencyCode: dto.currency_code,
    captureOnCheckIn: dto.capture_on_check_in,
    createdAt: dto.created_at,
    paymentIntents: dto.payment_intents ? dto.payment_intents.map(mapPaymentIntent) : null,
    invoices: dto.invoices ? dto.invoices.map(mapInvoice) : null
  };
}

function mapPaymentIntent(dto: PaymentIntentDto): PaymentIntentRead {
  return {
    id: dto.id,
    status: dto.status,
    amountMinor: dto.amount_minor,
    currencyCode: dto.currency_code,
    provider: dto.provider,
    providerReference: dto.provider_reference,
    captureOnCheckIn: dto.capture_on_check_in,
    paymentMethodStatus: dto.payment_method_status,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at
  };
}

function mapInvoice(dto: InvoiceDto): InvoiceRead {
  return {
    id: dto.id,
    status: dto.status,
    amountMinor: dto.amount_minor,
    currencyCode: dto.currency_code,
    issuedAt: dto.issued_at,
    dueAt: dto.due_at
  };
}
