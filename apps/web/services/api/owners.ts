import { CoreApiError } from './housekeeping';

const CORE_API_BASE_URL =
  process.env.NEXT_PUBLIC_CORE_API_BASE_URL ?? 'http://localhost:8000';
const FALLBACK_OWNER_ID = Number(process.env.NEXT_PUBLIC_OWNER_ID ?? '1');
const DEFAULT_OWNER_TOKEN = process.env.NEXT_PUBLIC_OWNER_TOKEN ?? 'demo-owner-token';

type PayoutMethod = 'bank_transfer' | 'pix' | 'paypal';
type PayoutSchedule = 'weekly' | 'monthly';

type OwnerComplianceStatus = 'clear' | 'pending' | 'restricted';
export interface OwnerMetrics {
  occupancyRate: number;
  revenueMtd: number;
  averageDailyRate: number;
  incidentCount: number;
  guestSatisfaction: number;
  pendingInvoices: number;
  propertiesActive: number;
}

export interface OwnerPayoutPreferences {
  method: PayoutMethod;
  beneficiaryName: string;
  bankAccountLast4: string | null;
  currency: string;
  payoutThreshold: number;
  schedule: PayoutSchedule;
  updatedAt: string;
  manualReviewRequired: boolean;
}

export interface OwnerOverview {
  ownerId: number;
  ownerName: string;
  email: string;
  phone: string;
  metrics: OwnerMetrics;
  payoutPreferences: OwnerPayoutPreferences;
  pendingVerifications: number;
  unreadNotifications: number;
  lastPayoutAt: string | null;
  complianceStatus: OwnerComplianceStatus;
  documentsSubmitted: number;
}

export interface OwnerPropertySummary {
  propertyId: number;
  propertyName: string;
  occupancyRate: number;
  revenueMtd: number;
  adr: number;
  lastIncidentAt: string | null;
  issuesOpen: number;
}

export interface OwnerInvoice {
  invoiceId: string;
  propertyName: string;
  dueDate: string;
  amountDue: number;
  currency: string;
  status: 'pending' | 'paid' | 'overdue';
}

export interface OwnerReport {
  reportId: string;
  title: string;
  period: string;
  url: string;
  generatedAt: string;
  format: 'pdf' | 'xlsx';
}

export interface OwnerNotification {
  id: string;
  title: string;
  message: string;
  category: string;
  createdAt: string;
  read: boolean;
}

export interface OwnerPayoutPreferencesInput {
  method: PayoutMethod;
  beneficiaryName: string;
  bankAccountLast4: string | null;
  currency: string;
  payoutThreshold: number;
  schedule: PayoutSchedule;
}

export interface OwnerDocumentUploadResult {
  documentId: string;
  status: 'pending' | 'queued';
  manualReviewId: string;
}

interface OwnerMetricsDto {
  occupancy_rate: number;
  revenue_mtd: number;
  average_daily_rate: number;
  incident_count: number;
  guest_satisfaction: number;
  pending_invoices: number;
  properties_active: number;
}

interface OwnerPayoutPreferencesDto {
  method: PayoutMethod;
  beneficiary_name: string;
  bank_account_last4: string | null;
  currency: string;
  payout_threshold: number;
  schedule: PayoutSchedule;
  updated_at: string;
  manual_review_required: boolean;
}

interface OwnerOverviewDto {
  owner_id: number;
  owner_name: string;
  email: string;
  phone: string;
  metrics: OwnerMetricsDto;
  payout_preferences: OwnerPayoutPreferencesDto;
  pending_verifications: number;
  unread_notifications: number;
  last_payout_at: string | null;
  compliance_status: OwnerComplianceStatus;
  documents_submitted: number;
}

interface OwnerPropertyDto {
  property_id: number;
  property_name: string;
  occupancy_rate: number;
  revenue_mtd: number;
  adr: number;
  last_incident_at: string | null;
  issues_open: number;
}

interface OwnerInvoiceDto {
  invoice_id: string;
  property_name: string;
  due_date: string;
  amount_due: number;
  currency: string;
  status: 'pending' | 'paid' | 'overdue';
}

interface OwnerReportDto {
  report_id: string;
  title: string;
  period: string;
  url: string;
  generated_at: string;
  format: 'pdf' | 'xlsx';
}

interface OwnerNotificationDto {
  id: string;
  title: string;
  message: string;
  category: string;
  created_at: string;
  read: boolean;
}

interface OwnerDocumentUploadDto {
  document_id: string;
  status: 'pending' | 'queued';
  manual_review_id: string;
}

const FALLBACK_STATE = {
  overview: {
    ownerId: FALLBACK_OWNER_ID,
    ownerName: 'Helena Pereira',
    email: 'helena.pereira@example.com',
    phone: '(+351) 912 345 678',
    metrics: {
      occupancyRate: 0.82,
      revenueMtd: 48500,
      averageDailyRate: 128,
      incidentCount: 2,
      guestSatisfaction: 4.6,
      pendingInvoices: 1,
      propertiesActive: 4
    },
    payoutPreferences: {
      method: 'bank_transfer',
      beneficiaryName: 'Helena Pereira',
      bankAccountLast4: '1234',
      currency: 'EUR',
      payoutThreshold: 1500,
      schedule: 'monthly',
      updatedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
      manualReviewRequired: false
    },
    pendingVerifications: 1,
    unreadNotifications: 1,
    lastPayoutAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
    complianceStatus: 'pending' as OwnerComplianceStatus,
    documentsSubmitted: 0
  } satisfies OwnerOverview,
  properties: [
    {
      propertyId: 101,
      propertyName: 'Lisboa Downtown Boutique',
      occupancyRate: 0.87,
      revenueMtd: 18200,
      adr: 142,
      lastIncidentAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      issuesOpen: 1
    },
    {
      propertyId: 102,
      propertyName: 'Porto Riverside Lofts',
      occupancyRate: 0.78,
      revenueMtd: 15840,
      adr: 135,
      lastIncidentAt: null,
      issuesOpen: 0
    },
    {
      propertyId: 103,
      propertyName: 'Coimbra Business Suites',
      occupancyRate: 0.69,
      revenueMtd: 9000,
      adr: 118,
      lastIncidentAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
      issuesOpen: 2
    }
  ] satisfies OwnerPropertySummary[],
  invoices: [
    {
      invoiceId: 'INV-2024-05-001',
      propertyName: 'Lisboa Downtown Boutique',
      dueDate: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      amountDue: 4200.35,
      currency: 'EUR',
      status: 'overdue' as const
    },
    {
      invoiceId: 'INV-2024-05-014',
      propertyName: 'Porto Riverside Lofts',
      dueDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
      amountDue: 3890.15,
      currency: 'EUR',
      status: 'pending' as const
    },
    {
      invoiceId: 'INV-2024-04-021',
      propertyName: 'Coimbra Business Suites',
      dueDate: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
      amountDue: 4100,
      currency: 'EUR',
      status: 'paid' as const
    }
  ] satisfies OwnerInvoice[],
  reports: [
    {
      reportId: 'RPT-occupancy-2024-04',
      title: 'Resumo de ocupação',
      period: 'Abr 2024',
      url: 'https://reports.bmad.example/occupancy-202404.pdf',
      generatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      format: 'pdf'
    },
    {
      reportId: 'RPT-revenue-2024-Q1',
      title: 'Receita consolidada Q1',
      period: 'Q1 2024',
      url: 'https://reports.bmad.example/revenue-q1-2024.xlsx',
      generatedAt: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString(),
      format: 'xlsx'
    }
  ] satisfies OwnerReport[],
  notifications: [
    {
      id: 'welcome',
      title: 'Portal ativado',
      message: 'Bem-vindo ao painel do proprietário. Documentos pendentes de revisão.',
      category: 'info',
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      read: false
    }
  ] satisfies OwnerNotification[]
};

function cloneState<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

async function requestJson<T>(
  path: string,
  token: string,
  init: RequestInit = {}
): Promise<T> {
  const url = new URL(path, CORE_API_BASE_URL);
  const headers = new Headers(init.headers ?? {});
  headers.set('Accept', 'application/json');
  headers.set('x-owner-token', token || DEFAULT_OWNER_TOKEN);
  const response = await fetch(url, { ...init, headers });
  if (!response.ok) {
    const body = await safeReadJson(response);
    throw new CoreApiError('Failed to call owner endpoint', response.status, body);
  }
  return (await response.json()) as T;
}

async function safeReadJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

function mapMetrics(dto: OwnerMetricsDto): OwnerMetrics {
  return {
    occupancyRate: dto.occupancy_rate,
    revenueMtd: dto.revenue_mtd,
    averageDailyRate: dto.average_daily_rate,
    incidentCount: dto.incident_count,
    guestSatisfaction: dto.guest_satisfaction,
    pendingInvoices: dto.pending_invoices,
    propertiesActive: dto.properties_active
  };
}

function mapPayoutPreferences(dto: OwnerPayoutPreferencesDto): OwnerPayoutPreferences {
  return {
    method: dto.method,
    beneficiaryName: dto.beneficiary_name,
    bankAccountLast4: dto.bank_account_last4,
    currency: dto.currency,
    payoutThreshold: dto.payout_threshold,
    schedule: dto.schedule,
    updatedAt: dto.updated_at,
    manualReviewRequired: dto.manual_review_required
  };
}

function mapOverview(dto: OwnerOverviewDto): OwnerOverview {
  return {
    ownerId: dto.owner_id,
    ownerName: dto.owner_name,
    email: dto.email,
    phone: dto.phone,
    metrics: mapMetrics(dto.metrics),
    payoutPreferences: mapPayoutPreferences(dto.payout_preferences),
    pendingVerifications: dto.pending_verifications,
    unreadNotifications: dto.unread_notifications,
    lastPayoutAt: dto.last_payout_at,
    complianceStatus: dto.compliance_status,
    documentsSubmitted: dto.documents_submitted
  };
}

function mapProperty(dto: OwnerPropertyDto): OwnerPropertySummary {
  return {
    propertyId: dto.property_id,
    propertyName: dto.property_name,
    occupancyRate: dto.occupancy_rate,
    revenueMtd: dto.revenue_mtd,
    adr: dto.adr,
    lastIncidentAt: dto.last_incident_at,
    issuesOpen: dto.issues_open
  };
}

function mapInvoice(dto: OwnerInvoiceDto): OwnerInvoice {
  return {
    invoiceId: dto.invoice_id,
    propertyName: dto.property_name,
    dueDate: dto.due_date,
    amountDue: dto.amount_due,
    currency: dto.currency,
    status: dto.status
  };
}

function mapReport(dto: OwnerReportDto): OwnerReport {
  return {
    reportId: dto.report_id,
    title: dto.title,
    period: dto.period,
    url: dto.url,
    generatedAt: dto.generated_at,
    format: dto.format
  };
}

function mapNotification(dto: OwnerNotificationDto): OwnerNotification {
  return {
    id: dto.id,
    title: dto.title,
    message: dto.message,
    category: dto.category,
    createdAt: dto.created_at,
    read: dto.read
  };
}

export async function fetchOwnerOverview(
  ownerId: number,
  token: string
): Promise<OwnerOverview> {
  try {
    const payload = await requestJson<OwnerOverviewDto>(`/owners/${ownerId}/overview`, token);
    const mapped = mapOverview(payload);
    FALLBACK_STATE.overview = { ...mapped };
    return mapped;
  } catch (error) {
    console.warn('[owners] overview fallback activated', error);
    return cloneState(FALLBACK_STATE.overview);
  }
}

export async function fetchOwnerProperties(
  ownerId: number,
  token: string
): Promise<OwnerPropertySummary[]> {
  try {
    const payload = await requestJson<OwnerPropertyDto[]>(`/owners/${ownerId}/properties`, token);
    const mapped = payload.map(mapProperty);
    FALLBACK_STATE.properties = [...mapped];
    return mapped;
  } catch (error) {
    console.warn('[owners] properties fallback activated', error);
    return cloneState(FALLBACK_STATE.properties);
  }
}

export async function fetchOwnerInvoices(
  ownerId: number,
  token: string
): Promise<OwnerInvoice[]> {
  try {
    const payload = await requestJson<OwnerInvoiceDto[]>(`/owners/${ownerId}/invoices`, token);
    const mapped = payload.map(mapInvoice);
    FALLBACK_STATE.invoices = [...mapped];
    return mapped;
  } catch (error) {
    console.warn('[owners] invoices fallback activated', error);
    return cloneState(FALLBACK_STATE.invoices);
  }
}

export async function fetchOwnerReports(
  ownerId: number,
  token: string
): Promise<OwnerReport[]> {
  try {
    const payload = await requestJson<OwnerReportDto[]>(`/owners/${ownerId}/reports`, token);
    const mapped = payload.map(mapReport);
    FALLBACK_STATE.reports = [...mapped];
    return mapped;
  } catch (error) {
    console.warn('[owners] reports fallback activated', error);
    return cloneState(FALLBACK_STATE.reports);
  }
}

export async function fetchOwnerNotifications(
  ownerId: number,
  token: string
): Promise<OwnerNotification[]> {
  try {
    const payload = await requestJson<OwnerNotificationDto[]>(
      `/owners/${ownerId}/notifications`,
      token
    );
    const mapped = payload.map(mapNotification);
    FALLBACK_STATE.notifications = [...mapped];
    return mapped;
  } catch (error) {
    console.warn('[owners] notifications fallback activated', error);
    return cloneState(FALLBACK_STATE.notifications);
  }
}

export async function updateOwnerPayoutPreferences(
  ownerId: number,
  token: string,
  payload: OwnerPayoutPreferencesInput
): Promise<OwnerPayoutPreferences> {
  const body = JSON.stringify({
    method: payload.method,
    beneficiary_name: payload.beneficiaryName,
    bank_account_last4: payload.bankAccountLast4,
    currency: payload.currency,
    payout_threshold: payload.payoutThreshold,
    schedule: payload.schedule
  });
  try {
    const response = await requestJson<OwnerPayoutPreferencesDto>(
      `/owners/${ownerId}/payout-preferences`,
      token,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      }
    );
    const mapped = mapPayoutPreferences(response);
    FALLBACK_STATE.overview.payoutPreferences = { ...mapped };
    if (mapped.manualReviewRequired) {
      FALLBACK_STATE.overview.pendingVerifications += 1;
      FALLBACK_STATE.notifications.unshift({
        id: `local-review-${Date.now()}`,
        title: 'Revisão manual necessária',
        message: 'Equipa de compliance irá rever a alteração nas preferências de pagamento.',
        category: 'compliance',
        createdAt: new Date().toISOString(),
        read: false
      });
    }
    return mapped;
  } catch (error) {
    console.warn('[owners] payout update fallback activated', error);
    const mapped: OwnerPayoutPreferences = {
      method: payload.method,
      beneficiaryName: payload.beneficiaryName,
      bankAccountLast4: payload.bankAccountLast4,
      currency: payload.currency,
      payoutThreshold: payload.payoutThreshold,
      schedule: payload.schedule,
      updatedAt: new Date().toISOString(),
      manualReviewRequired: payload.method !== FALLBACK_STATE.overview.payoutPreferences.method
    };
    FALLBACK_STATE.overview.payoutPreferences = { ...mapped };
    if (mapped.manualReviewRequired) {
      FALLBACK_STATE.overview.pendingVerifications += 1;
    }
    return mapped;
  }
}

export async function uploadOwnerDocument(
  ownerId: number,
  token: string,
  file: File,
  documentType: string
): Promise<OwnerDocumentUploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await requestJson<OwnerDocumentUploadDto>(
      `/owners/${ownerId}/kyc-documents`,
      token,
      {
        method: 'POST',
        body: formData
      }
    );
    FALLBACK_STATE.overview.documentsSubmitted += 1;
    FALLBACK_STATE.overview.pendingVerifications += 1;
    return {
      documentId: response.document_id,
      status: response.status,
      manualReviewId: response.manual_review_id
    };
  } catch (error) {
    console.warn('[owners] document upload fallback activated', error);
    const id = `local-doc-${Date.now()}`;
    FALLBACK_STATE.overview.documentsSubmitted += 1;
    FALLBACK_STATE.overview.pendingVerifications += 1;
    FALLBACK_STATE.notifications.unshift({
      id: `local-doc-notice-${Date.now()}`,
      title: 'Documento registado',
      message: `Documento ${documentType} em fila de revisão manual.`,
      category: 'compliance',
      createdAt: new Date().toISOString(),
      read: false
    });
    return {
      documentId: id,
      status: 'queued',
      manualReviewId: `manual-${Date.now()}`
    };
  }
}

export function resolveOwnerToken(token?: string | null): string {
  if (token && token.length > 0) {
    return token;
  }
  if (typeof window !== 'undefined') {
    const stored = window.sessionStorage.getItem('bmad-owner-token');
    if (stored) {
      return stored;
    }
  }
  return DEFAULT_OWNER_TOKEN;
}

export function fallbackOwnerId(): number {
  return FALLBACK_OWNER_ID;
}
