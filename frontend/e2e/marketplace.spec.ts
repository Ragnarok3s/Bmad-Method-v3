import { test, expect } from '@playwright/test';

test.describe('Marketplace', () => {
  test('permite filtrar apps e iniciar instalação', async ({ page }) => {
    await page.goto('/marketplace');

    await expect(page.getByRole('heading', { name: 'Marketplace de parceiros' })).toBeVisible();

    const automationFilter = page.getByRole('button', { name: /Automation/ });
    await automationFilter.click();

    const cards = page.locator('.marketplace-card');
    await expect(cards).toHaveCount(2);

    await page.getByRole('button', { name: 'Instalar' }).first().click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    await expect(dialog.getByText('Consentimentos granulares')).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Confirmar instalação' })).toBeDisabled();

    // ativa consentimentos
    const firstCheckbox = dialog.locator('input[type="checkbox"]').first();
    await firstCheckbox.uncheck();
    await firstCheckbox.check();

    await expect(dialog.getByRole('button', { name: 'Confirmar instalação' })).toBeEnabled();
  });
});
