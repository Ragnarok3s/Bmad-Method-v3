import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import OnboardingLayout from '@/app/onboarding/layout';
import OnboardingPage from '@/app/onboarding/page';
import { GuidedTourProvider } from '@/components/tour/TourContext';

jest.mock('@/components/tour/TourContext', () => {
  const React = require('react');
  return {
    GuidedTourProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    useGuidedTour: () => ({
      startTour: jest.fn(),
      hasCompleted: () => false
    })
  };
});

const STORAGE_KEY = 'bmad:onboarding:progress';

const originalFetch = global.fetch;

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  jest.restoreAllMocks();
  (global as unknown as { fetch: typeof fetch }).fetch = originalFetch;
  (window as unknown as { fetch: typeof fetch }).fetch = originalFetch;
  window.localStorage.clear();
});

function renderWizard() {
  return render(
    <GuidedTourProvider>
      <OnboardingLayout>
        <OnboardingPage />
      </OnboardingLayout>
    </GuidedTourProvider>
  );
}

describe('Onboarding wizard', () => {
  it('completes the flow and clears progress after sucesso', async () => {
    const user = userEvent.setup();
    const fetchMock = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => ({
          id: 42,
          slug: 'hotel-aurora',
          name: 'Hotel Aurora',
          timezone: 'Europe/Lisbon',
          team_size: 8,
          primary_use_case: 'Operações multi-propriedade',
          communication_channel: 'email',
          quarterly_goal: 'Expandir portfólio',
          invite_emails: ['ana@example.com', 'bruno@example.com'],
          team_roles: ['operations', 'customer_success'],
          enable_sandbox: true,
          require_mfa: true,
          security_notes: 'Alinhar integrações SSO',
          created_at: '2024-07-22T10:00:00Z'
        })
      } as unknown as Response);
    (global as unknown as { fetch: typeof fetch }).fetch = fetchMock;
    (window as unknown as { fetch: typeof fetch }).fetch = fetchMock;

    renderWizard();

    await user.type(screen.getByLabelText(/Nome do workspace/i), 'Hotel Aurora');
    await user.selectOptions(
      screen.getByLabelText(/Fuso horário principal/i),
      'Europe/Lisbon'
    );
    await user.type(
      screen.getByLabelText(/Uso prioritário da plataforma/i),
      'Operações multi-propriedade'
    );
    await user.selectOptions(
      screen.getByLabelText(/Canal de comunicação preferido/i),
      'email'
    );
    await user.type(
      screen.getByLabelText(/Meta trimestral/i),
      'Expandir portfólio e consolidar operações'
    );
    await user.click(screen.getByRole('button', { name: /Avançar/i }));

    const teamSizeInput = (await screen.findByLabelText(
      /Tamanho da equipa/i
    )) as HTMLInputElement;
    await user.clear(teamSizeInput);
    await user.type(teamSizeInput, '8');
    await user.click(screen.getByLabelText(/Operações diárias/i));
    await user.click(screen.getByLabelText(/Customer Success/i));
    await user.type(
      screen.getByLabelText(/E-mails para convite inicial/i),
      'ana@example.com\nbruno@example.com'
    );
    await user.click(screen.getByRole('button', { name: /Avançar/i }));

    const notesField = await screen.findByLabelText(
      /Notas adicionais de segurança/i
    );
    await user.type(notesField, 'Alinhar integrações SSO');
    const finishButton = await screen.findByRole('button', {
      name: /Concluir onboarding/i
    });
    await user.click(finishButton);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const [, requestInit] = fetchMock.mock.calls[0];
    const payload = JSON.parse((requestInit as RequestInit).body as string);
    expect(payload).toMatchObject({
      name: 'Hotel Aurora',
      timezone: 'Europe/Lisbon',
      team_size: 8,
      primary_use_case: 'Operações multi-propriedade',
      communication_channel: 'email',
      invite_emails: ['ana@example.com', 'bruno@example.com'],
      team_roles: expect.arrayContaining(['operations', 'customer_success'])
    });

    expect(
      screen.getByText(/Workspace criado com sucesso/i)
    ).toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('restores progresso parcial e apresenta erro quando API falha', async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        step: 1,
        updatedAt: new Date().toISOString(),
        values: {
          workspace: {
            name: 'Residencial Norte',
            timezone: 'UTC',
            primaryUseCase: 'Operações remotas',
            communicationChannel: 'slack',
            quarterlyGoal: 'Reduzir backlog em 30%'
          },
          team: {
            size: 6,
            roles: ['operations'],
            inviteEmails: 'ops@example.com'
          },
          readiness: {
            sandboxValidated: true,
            mfaConfigured: true,
            securityNotes: ''
          }
        }
      })
    );

    const user = userEvent.setup();
    const fetchMock = jest
      .fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>()
      .mockResolvedValue({
        ok: false,
        status: 422,
        json: async () => ({ detail: 'Dados inválidos' })
      } as unknown as Response);
    (global as unknown as { fetch: typeof fetch }).fetch = fetchMock;
    (window as unknown as { fetch: typeof fetch }).fetch = fetchMock;

    renderWizard();

    expect(screen.getByLabelText(/Tamanho da equipa/i)).toHaveValue(6);
    await user.click(screen.getByLabelText(/Housekeeping/i));
    await user.click(screen.getByRole('button', { name: /Avançar/i }));
    const finishButton = await screen.findByRole('button', {
      name: /Concluir onboarding/i
    });
    await user.click(finishButton);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    expect(
      screen.getByText(/Erro ao criar workspace/i)
    ).toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEY)).not.toBeNull();
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /Concluir onboarding/i })
      ).not.toBeDisabled()
    );
  });
});
