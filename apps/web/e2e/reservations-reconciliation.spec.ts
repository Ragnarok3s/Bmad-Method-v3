import { expect, test } from '@playwright/test';

const baseReservation = {
  id: 1,
  propertyId: 1,
  guestName: 'Hóspede 1',
  guestEmail: 'hospede1@example.com',
  status: 'confirmed' as const,
  checkIn: '2024-03-01T15:00:00Z',
  checkOut: '2024-03-05T11:00:00Z',
  totalAmountMinor: 56000,
  currencyCode: 'BRL',
  captureOnCheckIn: true,
  createdAt: '2024-02-20T12:00:00Z',
  paymentIntents: [],
  invoices: []
};

const reservationsResponse = {
  items: [
    baseReservation,
    {
      ...baseReservation,
      id: 2,
      guestName: 'Hóspede 2',
      guestEmail: 'hospede2@example.com',
      status: 'checked_in' as const,
      captureOnCheckIn: false,
      checkIn: '2024-03-03T15:00:00Z',
      checkOut: '2024-03-06T11:00:00Z'
    },
    {
      ...baseReservation,
      id: 3,
      guestName: 'Hóspede 3',
      guestEmail: 'hospede3@example.com',
      status: 'draft' as const,
      totalAmountMinor: null,
      currencyCode: null,
      captureOnCheckIn: false,
      checkIn: '2024-03-07T15:00:00Z',
      checkOut: '2024-03-09T11:00:00Z'
    }
  ],
  pagination: {
    page: 1,
    pageSize: 3,
    total: 3,
    totalPages: 1
  }
};

const updatedReservation = {
  ...baseReservation,
  status: 'checked_in' as const
};

const calendarResponse = {
  propertyId: 1,
  generatedAt: '2024-03-01T09:00:00Z',
  reservations: [
    {
      ...updatedReservation,
      status: 'checked_in' as const
    }
  ],
  reconciliationItems: [
    {
      id: 42,
      propertyId: 1,
      reservationId: 1,
      channelId: 77,
      externalBookingId: 'OTA-123',
      source: 'ota' as const,
      status: 'pending' as const,
      attempts: 2,
      nextActionAt: '2024-03-01T10:00:00Z',
      lastAttemptAt: '2024-03-01T08:00:00Z',
      createdAt: '2024-02-28T12:00:00Z',
      updatedAt: '2024-03-01T08:30:00Z',
      slaVersionId: 3,
      payload: {
        amountMinor: 56000,
        currencyCode: 'BRL',
        discrepancy: 'Pagamento duplicado na OTA'
      }
    }
  ],
  reservationsCount: 1,
  reconciliationCount: 1
};

const reconciliationInitial = {
  propertyId: 1,
  generatedAt: '2024-03-01T09:05:00Z',
  items: calendarResponse.reconciliationItems,
  pendingCount: 1
};

const reconciliationResolved = {
  propertyId: 1,
  generatedAt: '2024-03-01T09:10:00Z',
  items: [
    {
      ...calendarResponse.reconciliationItems[0],
      status: 'resolved' as const,
      updatedAt: '2024-03-01T09:09:00Z'
    }
  ],
  pendingCount: 0
};

test.describe('Reservas e reconciliação', () => {
  test('permite jornada de reservas e reconciliação manual', async ({ page }) => {
    await page.route('**/properties/1/reservations**', async (route, request) => {
      if (request.method() === 'GET') {
        await route.fulfill({
          status: 200,
          body: JSON.stringify(reservationsResponse),
          headers: { 'content-type': 'application/json' }
        });
        return;
      }
      await route.continue();
    });

    await page.route('**/reservations/1', async (route, request) => {
      if (request.method() === 'PATCH') {
        await route.fulfill({
          status: 200,
          body: JSON.stringify(updatedReservation),
          headers: { 'content-type': 'application/json' }
        });
        return;
      }
      await route.continue();
    });

    await page.goto('/reservas');

    await expect(page.getByRole('heading', { name: 'Gestão de Reservas' })).toBeVisible();
    await expect(page.getByTestId('reservations-summary')).toHaveText('A mostrar 3 de 3 reservas.');

    const statusButton = page.getByRole('button', { name: 'Registar check-in' }).first();
    await statusButton.click();

    await expect(page.getByRole('button', { name: 'Concluir check-out' })).toBeVisible();

    await page.route('**/properties/1/calendar**', async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify(calendarResponse),
        headers: { 'content-type': 'application/json' }
      });
    });

    let reconciliationFetchCount = 0;
    await page.route('**/properties/1/inventory/reconciliation**', async (route) => {
      const payload = reconciliationFetchCount === 0 ? reconciliationInitial : reconciliationResolved;
      reconciliationFetchCount += 1;
      await route.fulfill({
        status: 200,
        body: JSON.stringify(payload),
        headers: { 'content-type': 'application/json' }
      });
    });

    await page.route('**/properties/1/inventory/reconciliation/42/resolve', async (route, request) => {
      if (request.method() === 'POST') {
        await route.fulfill({ status: 204, body: '' });
        return;
      }
      await route.continue();
    });

    await page.goto('/calendar');

    await expect(page.getByRole('heading', { name: 'Calendário operacional unificado' })).toBeVisible();
    await expect(page.getByText('Reserva #1')).toBeVisible();

    const reconcileButton = page.getByRole('button', { name: 'Conciliar manualmente' });
    await expect(reconcileButton).toBeVisible();
    await reconcileButton.click();

    await expect(page.getByRole('status')).toContainText('Item reconciliado manualmente');
    await expect(page.getByRole('button', { name: 'Conciliar manualmente' })).toHaveCount(0);
    await expect(page.locator('.queue-row').getByText('Resolvido')).toBeVisible();
  });
});
