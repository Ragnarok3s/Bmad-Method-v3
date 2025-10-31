import { describe, expect, it, vi } from 'vitest';

import type { CoreApiClient, RequestOptions } from '../src/core.js';
import {
  PropertyApi,
  type PropertyCalendarResponse,
  type PropertyInventoryReconciliationResponse,
  type ReconciliationStatus
} from '../src/properties.js';

function createMockClient<T>(response: T) {
  const request = vi.fn(async (_options: RequestOptions) => response);
  const client = { request } as unknown as CoreApiClient;
  return { client, request };
}

describe('PropertyApi', () => {
  it('requests property calendar with filters and maps the response', async () => {
    const reservationDto = {
      id: 7,
      property_id: 12,
      guest_name: 'Ada Lovelace',
      guest_email: 'ada@example.com',
      status: 'confirmed' as const,
      check_in: '2024-06-01T15:00:00Z',
      check_out: '2024-06-05T11:00:00Z',
      total_amount_minor: 125000,
      currency_code: 'USD',
      capture_on_check_in: true,
      created_at: '2024-05-20T10:00:00Z',
      payment_intents: [
        {
          id: 3,
          status: 'captured' as const,
          amount_minor: 125000,
          currency_code: 'USD',
          provider: 'stripe' as const,
          provider_reference: 'pi_123',
          capture_on_check_in: true,
          payment_method_status: 'active' as const,
          created_at: '2024-05-20T10:00:00Z',
          updated_at: '2024-05-21T10:00:00Z'
        }
      ],
      invoices: [
        {
          id: 5,
          status: 'issued' as const,
          amount_minor: 125000,
          currency_code: 'USD',
          issued_at: '2024-05-20T10:00:00Z',
          due_at: null
        }
      ]
    };

    const reconciliationDto = {
      id: 42,
      property_id: 12,
      reservation_id: 7,
      channel_id: 9,
      external_booking_id: 'ABC123',
      source: 'ota' as const,
      status: 'pending' as ReconciliationStatus,
      attempts: 2,
      next_action_at: '2024-06-02T10:00:00Z',
      last_attempt_at: '2024-06-01T08:00:00Z',
      created_at: '2024-06-01T07:30:00Z',
      updated_at: '2024-06-01T08:00:00Z',
      sla_version_id: 4,
      payload: { bookingId: 'ABC123' }
    };

    const calendarDto = {
      property_id: 12,
      generated_at: '2024-05-25T12:00:00Z',
      reservations: [reservationDto],
      reconciliation_items: [reconciliationDto],
      reservations_count: 1,
      reconciliation_count: 1
    };

    const { client, request } = createMockClient(calendarDto);
    const api = new PropertyApi(client);

    const controller = new AbortController();
    const result = await api.getPropertyCalendar(12, {
      startDate: '2024-06-01',
      endDate: '2024-06-30',
      signal: controller.signal
    });

    expect(request).toHaveBeenCalledWith({
      path: '/properties/12/calendar',
      method: 'GET',
      query: { startDate: '2024-06-01', endDate: '2024-06-30' },
      signal: controller.signal
    });

    const expected: PropertyCalendarResponse = {
      propertyId: 12,
      generatedAt: '2024-05-25T12:00:00Z',
      reservations: [
        {
          id: 7,
          propertyId: 12,
          guestName: 'Ada Lovelace',
          guestEmail: 'ada@example.com',
          status: 'confirmed',
          checkIn: '2024-06-01T15:00:00Z',
          checkOut: '2024-06-05T11:00:00Z',
          totalAmountMinor: 125000,
          currencyCode: 'USD',
          captureOnCheckIn: true,
          createdAt: '2024-05-20T10:00:00Z',
          paymentIntents: [
            {
              id: 3,
              status: 'captured',
              amountMinor: 125000,
              currencyCode: 'USD',
              provider: 'stripe',
              providerReference: 'pi_123',
              captureOnCheckIn: true,
              paymentMethodStatus: 'active',
              createdAt: '2024-05-20T10:00:00Z',
              updatedAt: '2024-05-21T10:00:00Z'
            }
          ],
          invoices: [
            {
              id: 5,
              status: 'issued',
              amountMinor: 125000,
              currencyCode: 'USD',
              issuedAt: '2024-05-20T10:00:00Z',
              dueAt: null
            }
          ]
        }
      ],
      reconciliationItems: [
        {
          id: 42,
          propertyId: 12,
          reservationId: 7,
          channelId: 9,
          externalBookingId: 'ABC123',
          source: 'ota',
          status: 'pending',
          attempts: 2,
          nextActionAt: '2024-06-02T10:00:00Z',
          lastAttemptAt: '2024-06-01T08:00:00Z',
          createdAt: '2024-06-01T07:30:00Z',
          updatedAt: '2024-06-01T08:00:00Z',
          slaVersionId: 4,
          payload: { bookingId: 'ABC123' }
        }
      ],
      reservationsCount: 1,
      reconciliationCount: 1
    };

    expect(result).toEqual(expected);
  });

  it('requests property reconciliation with params and maps the response', async () => {
    const reconciliationDto = {
      id: 55,
      property_id: 77,
      reservation_id: null,
      channel_id: 2,
      external_booking_id: null,
      source: 'manual' as const,
      status: 'in_review' as ReconciliationStatus,
      attempts: 1,
      next_action_at: null,
      last_attempt_at: '2024-05-20T09:00:00Z',
      created_at: '2024-05-19T08:00:00Z',
      updated_at: '2024-05-20T09:00:00Z',
      sla_version_id: null,
      payload: { note: 'verify totals' }
    };

    const inventoryDto = {
      property_id: 77,
      generated_at: '2024-05-21T10:00:00Z',
      items: [reconciliationDto],
      pending_count: 1
    };

    const { client, request } = createMockClient(inventoryDto);
    const api = new PropertyApi(client);
    const controller = new AbortController();

    const result = await api.getInventoryReconciliation(77, {
      statuses: ['pending', 'in_review'],
      signal: controller.signal
    });

    expect(request).toHaveBeenCalledWith({
      path: '/properties/77/inventory/reconciliation',
      method: 'GET',
      query: { statuses: 'pending,in_review' },
      signal: controller.signal
    });

    const expected: PropertyInventoryReconciliationResponse = {
      propertyId: 77,
      generatedAt: '2024-05-21T10:00:00Z',
      items: [
        {
          id: 55,
          propertyId: 77,
          reservationId: null,
          channelId: 2,
          externalBookingId: null,
          source: 'manual',
          status: 'in_review',
          attempts: 1,
          nextActionAt: null,
          lastAttemptAt: '2024-05-20T09:00:00Z',
          createdAt: '2024-05-19T08:00:00Z',
          updatedAt: '2024-05-20T09:00:00Z',
          slaVersionId: null,
          payload: { note: 'verify totals' }
        }
      ],
      pendingCount: 1
    };

    expect(result).toEqual(expected);
  });
});
