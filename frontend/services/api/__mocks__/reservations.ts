import type { ReservationRead, ReservationStatus } from '@bmad/api-client';

import type { ReservationListResponse } from '@/services/api/reservations';

const baseDate = new Date('2024-03-01T12:00:00Z');

function daysFromBase(days: number): string {
  return new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000).toISOString();
}

function buildReservation(
  id: number,
  overrides: Partial<ReservationRead> & { status?: ReservationStatus }
): ReservationRead {
  return {
    id,
    propertyId: 1,
    guestName: `Hóspede ${id}`,
    guestEmail: `hospede${id}@example.com`,
    status: 'confirmed',
    checkIn: daysFromBase(id),
    checkOut: daysFromBase(id + 2),
    totalAmountMinor: 42000,
    currencyCode: 'BRL',
    captureOnCheckIn: true,
    createdAt: daysFromBase(id - 1),
    paymentIntents: [],
    invoices: [],
    ...overrides,
    status: overrides.status ?? 'confirmed'
  };
}

export const reservationsFixture: ReservationListResponse = {
  items: [
    buildReservation(1, { status: 'confirmed' }),
    buildReservation(2, { status: 'checked_in', captureOnCheckIn: false }),
    buildReservation(3, { status: 'draft', totalAmountMinor: null, currencyCode: null })
  ],
  pagination: {
    page: 1,
    pageSize: 3,
    total: 6,
    totalPages: 2
  }
};

export const reservationsSecondPageFixture: ReservationListResponse = {
  items: [
    buildReservation(4, { status: 'confirmed' }),
    buildReservation(5, { status: 'cancelled' }),
    buildReservation(6, { status: 'checked_out' })
  ],
  pagination: {
    page: 2,
    pageSize: 3,
    total: 6,
    totalPages: 2
  }
};
