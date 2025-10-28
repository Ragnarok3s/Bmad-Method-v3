import { expect, test } from '@playwright/test';

const shouldVerify = process.env.VERIFY_DASHBOARD_METRICS === 'true';
const webBaseUrl = (
  process.env.WEB_APP_BASE_URL ??
  process.env.NEXT_PUBLIC_WEB_BASE_URL ??
  'http://localhost:3000'
).replace(/\/$/, '');

test.describe('Analytics dashboard overview', () => {
  test.skip(
    !shouldVerify,
    'Defina VERIFY_DASHBOARD_METRICS=true para validar widgets do dashboard contra a API.'
  );

  test('renderiza métricas consistentes com a API', async ({ page, request, baseURL }) => {
    expect(baseURL).toBeTruthy();

    const response = await request.get('/metrics/overview');
    expect(response.ok()).toBeTruthy();

    const metrics = (await response.json()) as {
      occupancy: { occupancy_rate: number; total_units: number; occupied_units: number };
      nps: { score: number; total_responses: number };
      sla: { breached: number; total: number };
      operational: {
        housekeeping_completion_rate: { value: number };
        ota_sync_backlog: { value: number };
        critical_alerts: { examples: Array<{ task_id: number }> };
      };
    };

    await page.goto(`${webBaseUrl}/analytics`);

    await expect(page.getByTestId('dashboard-metric-occupancy')).toContainText(
      (metrics.occupancy.occupancy_rate * 100).toFixed(1)
    );
    await expect(page.getByTestId('dashboard-metric-nps')).toContainText(
      metrics.nps.score.toFixed(1)
    );
    await expect(page.getByTestId('dashboard-metric-sla')).toContainText(
      `${metrics.sla.breached}/${metrics.sla.total}`
    );
    await expect(page.getByTestId('dashboard-metric-housekeeping')).toContainText(
      (metrics.operational.housekeeping_completion_rate.value).toFixed(1)
    );
    await expect(page.getByTestId('dashboard-metric-ota')).toContainText(
      Math.round(metrics.operational.ota_sync_backlog.value).toString()
    );

    if (metrics.operational.critical_alerts.examples.length > 0) {
      await expect(page.getByTestId('dashboard-critical-alerts')).toContainText(
        metrics.operational.critical_alerts.examples[0].task_id.toString()
      );
    }
  });
});
