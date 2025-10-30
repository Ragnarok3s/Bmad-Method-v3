import { by, device, element, expect } from 'detox';

const sampleTask = {
  id: 501,
  propertyId: 1,
  reservationId: 8842,
  assignedAgentId: 12,
  status: 'pending',
  scheduledDate: new Date().toISOString(),
  notes: 'Inspecionar minibar e repor amenities.',
  createdAt: new Date().toISOString()
};

async function seedHousekeepingTasks(): Promise<void> {
  await device.sendToApp({
    type: 'seed-housekeeping',
    params: {
      tasks: [sampleTask]
    }
  });
}

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

  it('expõe o cartão em ordem de leitura compatível com VoiceOver', async () => {
    await seedHousekeepingTasks();
    await expect(element(by.id('housekeeping-card-501-title'))).toHaveLabel('Tarefa #501');
    await expect(element(by.id('housekeeping-card-501-status'))).toHaveText('Pendente');
    await expect(element(by.id('housekeeping-card-501-notes'))).toHaveText(
      'Inspecionar minibar e repor amenities.'
    );
    await expect(element(by.id('housekeeping-card-501-toggle'))).toHaveLabel(
      'Marcar como concluída para a tarefa 501. Estado atual: Pendente.'
    );
  });

  it('permite ativação via switch control no botão de ação', async () => {
    await seedHousekeepingTasks();
    await element(by.id('housekeeping-card-501-toggle')).tap();
    await expect(element(by.id('housekeeping-card-501-status'))).toHaveText('Concluída');
    await expect(element(by.id('housekeeping-card-501-toggle'))).toHaveLabel(
      'Reabrir tarefa para a tarefa 501. Estado atual: Concluída.'
    );
  });

  it('fornece feedback audível através do modal acessível', async () => {
    await device.pressBack();
    await element(by.text('Incidentes')).tap();
    await element(by.text('Enviar incidente')).tap();
    await expect(element(by.id('incidents-feedback-modal'))).toBeVisible();
    await expect(element(by.id('incidents-feedback-modal-confirm'))).toHaveLabel('Corrigir');
    await element(by.id('incidents-feedback-modal-confirm')).tap();
    await expect(element(by.id('incidents-feedback-modal'))).not.toExist();
  });
});
