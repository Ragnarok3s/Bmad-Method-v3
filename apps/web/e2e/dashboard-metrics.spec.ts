import { test, expect } from '@playwright/test';

test.describe('Dashboard operacional', () => {
  test.skip(
    process.env.VERIFY_DASHBOARD_METRICS !== 'true',
    'Defina VERIFY_DASHBOARD_METRICS=true para validar métricas reais no dashboard.'
  );

  test('renderiza métricas provenientes do core', async ({ page, request }) => {
    const apiBase =
      process.env.NEXT_PUBLIC_CORE_API_BASE_URL ??
      process.env.CORE_API_BASE_URL ??
      'http://localhost:8000';
    const normalizedBase = apiBase.replace(/\/$/, '');
    const response = await request.get(`${normalizedBase}/metrics/overview`);
    expect(response.ok()).toBeTruthy();

    const payload = await response.json();

    await page.goto('/');

    const occupancyRate = Math.round((payload.occupancy?.occupancy_rate ?? 0) * 100);
    if (payload.occupancy?.total_units > 0) {
      await expect(page.getByTestId('kpi-occupancy-value')).toContainText(
        new RegExp(`${occupancyRate}`)
      );
    } else {
      await expect(page.getByTestId('kpi-occupancy-empty')).toBeVisible();
    }

    if (payload.critical_alerts?.total > 0) {
      await expect(page.getByTestId('kpi-alerts-value')).toHaveText(
        String(payload.critical_alerts.total)
      );
    } else {
      await expect(page.getByTestId('kpi-alerts-empty')).toBeVisible();
    }

    if (payload.playbook_adoption?.total_executions > 0) {
      const adoptionRate = Math.round(payload.playbook_adoption.adoption_rate * 100);
      await expect(page.getByTestId('kpi-playbooks-value')).toContainText(
        new RegExp(`${adoptionRate}`)
      );
    } else {
      await expect(page.getByTestId('kpi-playbooks-empty')).toBeVisible();
    }
  });
});
