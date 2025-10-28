import { test, expect } from '@playwright/test';

test.describe('Navegação principal', () => {
  test('deve permitir percorrer módulos chave', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Dashboard de Operações' })).toBeVisible();

    await page.getByRole('link', { name: 'Housekeeping' }).click();
    await expect(page.getByRole('heading', { name: 'Housekeeping' })).toBeVisible();

    await page.getByRole('link', { name: 'Analytics' }).click();
    await expect(page.getByRole('heading', { name: 'Analytics & Insights' })).toBeVisible();

    await page.getByRole('button', { name: 'Iniciar tour guiado' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: 'Concluir tour' }).click();
    await expect(page.getByRole('dialog')).toBeHidden();
  });
});
