import { test, expect } from '@playwright/test';

test.describe('Portal do proprietário', () => {
  test('permite autenticar, navegar e actualizar dados críticos', async ({ page }) => {
    await page.goto('/owners');

    await expect(page.getByRole('heading', { name: 'Portal do Proprietário' })).toBeVisible();
    await page.getByTestId('owner-access-code').fill('demo-owner-token');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page.getByTestId('owner-content')).toBeVisible();
    await expect(page.getByTestId('owner-overview-metric-occupancy')).toBeVisible();

    await page.getByRole('link', { name: 'Propriedades' }).click();
    await expect(page.getByTestId('owner-properties-list')).toBeVisible();

    await page.getByRole('link', { name: 'Faturas' }).click();
    await expect(page.getByTestId('owner-invoices-table')).toBeVisible();

    await page.getByRole('link', { name: 'Relatórios' }).click();
    await expect(page.getByTestId('owner-reports-list')).toBeVisible();

    await page.getByRole('link', { name: 'Overview' }).click();
    await page.getByTestId('owner-payout-method').selectOption('pix');
    await page.getByRole('button', { name: 'Guardar preferências' }).click();
    await expect(page.getByTestId('owner-update-feedback')).toContainText('Preferências de pagamento');
  });
});
