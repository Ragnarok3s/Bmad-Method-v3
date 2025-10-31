import { CoreApiError } from '@bmad/api-client';
import type {
  PropertyCalendarResponse,
  PropertyInventoryReconciliationResponse,
  ReconciliationStatus
} from '@bmad/api-client';

import {
  fetchInventoryReconciliation,
  fetchPropertyCalendar
} from '../properties';
import { getApiClient } from '../client';

jest.mock('../client', () => ({
  getApiClient: jest.fn()
}));

const mockGetApiClient = getApiClient as jest.MockedFunction<typeof getApiClient>;

describe('properties api service', () => {
  const propertyId = 42;
  let propertyApiMock: {
    getPropertyCalendar: jest.Mock;
    getInventoryReconciliation: jest.Mock;
  };

  const calendarResponse: PropertyCalendarResponse = {
    propertyId,
    generatedAt: '2024-06-01T00:00:00Z',
    reservations: [
      {
        id: 1,
        propertyId,
        guestName: 'Jane Doe',
        guestEmail: 'jane@example.com',
        status: 'confirmed',
        checkIn: '2024-06-10T15:00:00Z',
        checkOut: '2024-06-15T11:00:00Z',
        totalAmountMinor: 100000,
        currencyCode: 'USD',
        captureOnCheckIn: false,
        createdAt: '2024-05-01T12:00:00Z',
        paymentIntents: null,
        invoices: null
      }
    ],
    reconciliationItems: [
      {
        id: 7,
        propertyId,
        reservationId: 1,
        channelId: 99,
        externalBookingId: 'ABC123',
        source: 'ota',
        status: 'pending',
        attempts: 1,
        nextActionAt: null,
        lastAttemptAt: '2024-06-01T00:00:00Z',
        createdAt: '2024-05-31T10:00:00Z',
        updatedAt: '2024-05-31T10:00:00Z',
        slaVersionId: null,
        payload: {}
      }
    ],
    reservationsCount: 1,
    reconciliationCount: 1
  };

  const reconciliationResponse: PropertyInventoryReconciliationResponse = {
    propertyId,
    generatedAt: '2024-06-01T00:00:00Z',
    items: [
      {
        id: 9,
        propertyId,
        reservationId: null,
        channelId: null,
        externalBookingId: null,
        source: 'manual',
        status: 'pending',
        attempts: 2,
        nextActionAt: null,
        lastAttemptAt: '2024-05-30T00:00:00Z',
        createdAt: '2024-05-30T00:00:00Z',
        updatedAt: '2024-05-30T00:00:00Z',
        slaVersionId: null,
        payload: {}
      }
    ],
    pendingCount: 1
  };

  beforeEach(() => {
    propertyApiMock = {
      getPropertyCalendar: jest.fn().mockResolvedValue(calendarResponse),
      getInventoryReconciliation: jest.fn().mockResolvedValue(reconciliationResponse)
    };

    mockGetApiClient.mockReturnValue({
      properties: propertyApiMock
    } as unknown as ReturnType<typeof getApiClient>);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('normalizes calendar filters and returns the calendar response', async () => {
    const controller = new AbortController();

    const result = await fetchPropertyCalendar(propertyId, {
      startDate: '2024-06-01',
      endDate: '2024-06-15',
      signal: controller.signal
    });

    expect(propertyApiMock.getPropertyCalendar).toHaveBeenCalledWith(propertyId, {
      signal: controller.signal,
      startDate: '2024-06-01T00:00:00Z',
      endDate: '2024-06-15T23:59:59Z'
    });
    expect(result).toBe(calendarResponse);
  });

  it('deduplicates statuses before fetching inventory reconciliation', async () => {
    const controller = new AbortController();
    const statuses: ReconciliationStatus[] = ['pending', 'resolved', 'pending'];

    await fetchInventoryReconciliation(propertyId, {
      statuses,
      signal: controller.signal
    });

    expect(propertyApiMock.getInventoryReconciliation).toHaveBeenCalledWith(propertyId, {
      signal: controller.signal,
      statuses: ['pending', 'resolved']
    });
  });

  it('rethrows CoreApiError from the calendar fetch', async () => {
    const coreError = new CoreApiError('upstream error', 400, { foo: 'bar' });
    propertyApiMock.getPropertyCalendar.mockRejectedValue(coreError);

    await expect(fetchPropertyCalendar(propertyId)).rejects.toBe(coreError);
  });

  it('wraps unexpected errors from the reconciliation fetch', async () => {
    propertyApiMock.getInventoryReconciliation.mockRejectedValue(new Error('network down'));

    const promise = fetchInventoryReconciliation(propertyId);

    await expect(promise).rejects.toBeInstanceOf(CoreApiError);
    await promise.catch((error) => {
      expect(error).toMatchObject({
        message: 'Failed to load property inventory reconciliation'
      });
    });
  });
});
