import { by, device, element, expect } from 'detox';

describe('Bmad Mobile smoke test', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      permissions: { notifications: 'YES' }
    });
  });

  afterAll(async () => {
    await device.terminateApp();
  });

  it('navigates to housekeeping screen', async () => {
    await expect(element(by.text('Operações'))).toBeVisible();
    await element(by.text('Checklists de limpeza')).tap();
    await expect(element(by.text('Nenhuma tarefa encontrada.'))).toBeVisible();
  });
});
