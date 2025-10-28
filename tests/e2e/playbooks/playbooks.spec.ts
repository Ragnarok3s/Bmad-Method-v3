import { test, expect } from '@playwright/test';

const shouldVerify = process.env.VERIFY_PLAYBOOK_AUTOMATION === 'true';

test.describe('Playbooks API', () => {
  test.skip(
    !shouldVerify,
    'Defina VERIFY_PLAYBOOK_AUTOMATION=true para validar criação e execução de playbooks.'
  );

  test('permite criar e executar um playbook template', async ({ request, baseURL }) => {
    const payload = {
      name: `Playbook QA ${Date.now()}`,
      summary: 'Template criado automaticamente para testes end-to-end.',
      tags: ['qa', 'resposta-rapida'],
      steps: ['Validar contexto de execução', 'Acionar automações', 'Confirmar conclusão']
    };

    const createResponse = await request.post('/playbooks', {
      data: payload
    });
    expect(createResponse.ok()).toBeTruthy();

    const created = await createResponse.json();
    expect(created).toMatchObject({
      name: payload.name,
      summary: payload.summary,
      execution_count: 0
    });

    const listResponse = await request.get('/playbooks');
    expect(listResponse.ok()).toBeTruthy();
    const playbooks = (await listResponse.json()) as Array<{ id: number; name: string }>;
    const found = playbooks.find((item) => item.id === created.id);
    expect(found).toBeTruthy();

    const executeResponse = await request.post(`/playbooks/${created.id}/execute`, {
      data: { initiated_by: 'playwright-e2e' }
    });
    expect(executeResponse.status()).toBe(202);
    const execution = await executeResponse.json();
    expect(execution).toMatchObject({
      playbook_id: created.id,
      status: 'completed',
      initiated_by: 'playwright-e2e'
    });
    expect(typeof execution.run_id).toBe('string');

    const refreshedResponse = await request.get('/playbooks');
    expect(refreshedResponse.ok()).toBeTruthy();
    const refreshed = (await refreshedResponse.json()) as Array<{
      id: number;
      execution_count: number;
      last_executed_at: string | null;
    }>;
    const executed = refreshed.find((item) => item.id === created.id);
    expect(executed).toBeTruthy();
    expect(executed?.execution_count).toBeGreaterThanOrEqual(1);
    expect(executed?.last_executed_at).not.toBeNull();

    if (!baseURL) {
      test.info().annotations.push({ type: 'warning', description: 'Base URL não definida na configuração.' });
    }
  });
});
