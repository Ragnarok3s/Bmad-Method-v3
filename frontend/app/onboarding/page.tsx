'use client';

import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { Card } from '@/components/ui/Card';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { useGuidedTour } from '@/components/tour/TourContext';

import { useOnboardingWizard } from './layout';
import type { OnboardingFormValues } from './types';

const ROLE_OPTIONS = [
  { value: 'operations', label: 'Operações diárias' },
  { value: 'housekeeping', label: 'Housekeeping' },
  { value: 'customer_success', label: 'Customer Success' }
];

const TIMEZONE_OPTIONS = [
  { value: 'UTC', label: 'UTC' },
  { value: 'Europe/Lisbon', label: 'Europa/Lisboa' },
  { value: 'America/Sao_Paulo', label: 'América/São Paulo' }
];

const CHANNEL_OPTIONS = [
  { value: 'slack', label: 'Slack' },
  { value: 'email', label: 'Email' },
  { value: 'teams', label: 'Microsoft Teams' },
  { value: 'other', label: 'Outro canal' }
];

export default function OnboardingPage() {
  const {
    currentStep,
    next,
    previous,
    isFirstStep,
    isLastStep,
    complete,
    isSubmitting,
    completedWorkspace,
    reset
  } = useOnboardingWizard();
  const form = useFormContext<OnboardingFormValues>();
  const { handleSubmit } = form;

  const handleNext = handleSubmit(() => {
    next();
  });

  const handleFinish = handleSubmit(async (values) => {
    await complete(values);
  });

  if (completedWorkspace) {
    return (
      <Card
        title="Workspace criado com sucesso"
        description="Pode avançar para a configuração de automações e dashboards."
        accent="success"
      >
        <p>
          O workspace <strong>{completedWorkspace.name}</strong> foi registado com o
          identificador <code>{completedWorkspace.slug}</code>.
        </p>
        <p>
          Equipa prevista: <strong>{completedWorkspace.teamSize} membros</strong> · Canal
          preferido: <strong>{mapChannelLabel(completedWorkspace.communicationChannel)}</strong>
        </p>
        <button type="button" className="secondary" onClick={reset}>
          Iniciar novo onboarding
        </button>
        <style jsx>{`
          p {
            margin: 0 0 var(--space-3);
          }
          button {
            justify-self: start;
          }
        `}</style>
      </Card>
    );
  }

  const onSubmit = isLastStep ? handleFinish : handleNext;

  return (
    <form onSubmit={onSubmit} noValidate>
      {currentStep === 0 && <WorkspaceStep />}
      {currentStep === 1 && <TeamStep />}
      {currentStep === 2 && <ReadinessStep />}

      <footer className="wizard-actions">
        {!isFirstStep && (
          <button type="button" className="secondary" onClick={previous}>
            Voltar
          </button>
        )}
        <button type="submit" className="primary" disabled={isSubmitting}>
          {isLastStep ? (isSubmitting ? 'Enviando…' : 'Concluir onboarding') : 'Avançar'}
        </button>
      </footer>
      <style jsx>{`
        form {
          display: grid;
          gap: var(--space-5);
        }
        .wizard-actions {
          display: flex;
          justify-content: space-between;
          gap: var(--space-3);
        }
        .wizard-actions button {
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius-sm);
          font-weight: 600;
          cursor: pointer;
          border: none;
        }
        .wizard-actions .secondary {
          background: var(--color-neutral-6);
          color: var(--color-deep-blue);
        }
        .wizard-actions .primary {
          background: var(--color-deep-blue);
          color: #fff;
        }
        .wizard-actions .primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  );
}

function WorkspaceStep() {
  const {
    register,
    formState: { errors }
  } = useFormContext<OnboardingFormValues>();

  return (
    <Card title="Informações do workspace">
      <ResponsiveGrid columns={2}>
        <label className="field">
          <span>Nome do workspace</span>
          <input
            {...register('workspace.name', {
              required: 'Informe o nome do workspace'
            })}
            placeholder="Ex.: Squad Operações Sul"
          />
          {errors.workspace?.name && (
            <span className="error">{errors.workspace.name.message}</span>
          )}
        </label>
        <label className="field">
          <span>Fuso horário principal</span>
          <select {...register('workspace.timezone')}>
            {TIMEZONE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Uso prioritário da plataforma</span>
          <input
            {...register('workspace.primaryUseCase', {
              required: 'Descreva o objetivo principal'
            })}
            placeholder="Ex.: Operações multi-propriedade"
          />
          {errors.workspace?.primaryUseCase && (
            <span className="error">{errors.workspace.primaryUseCase.message}</span>
          )}
        </label>
        <label className="field">
          <span>Canal de comunicação preferido</span>
          <select {...register('workspace.communicationChannel')}>
            {CHANNEL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </ResponsiveGrid>
      <label className="field">
        <span>Meta trimestral</span>
        <textarea
          {...register('workspace.quarterlyGoal', {
            required: 'Defina a meta principal deste trimestre'
          })}
          rows={3}
          placeholder="Ex.: Aumentar ocupação média para 80% e reduzir backlog operacional em 20%"
        />
        {errors.workspace?.quarterlyGoal && (
          <span className="error">{errors.workspace.quarterlyGoal.message}</span>
        )}
      </label>
      <FieldStyles />
    </Card>
  );
}

function TeamStep() {
  const {
    register,
    formState: { errors }
  } = useFormContext<OnboardingFormValues>();
  const rolesRegister = register('team.roles', {
    validate: (value) =>
      Array.isArray(value) && value.length > 0
        ? true
        : 'Selecione pelo menos um perfil de agente'
  });

  return (
    <Card title="Equipa e agentes">
      <ResponsiveGrid columns={2}>
        <label className="field">
          <span>Tamanho da equipa</span>
          <input
            type="number"
            min={1}
            {...register('team.size', {
              required: 'Informe o número de colaboradores',
              valueAsNumber: true,
              min: { value: 1, message: 'Informe ao menos 1 colaborador' }
            })}
            placeholder="Ex.: 12"
          />
          {errors.team?.size && (
            <span className="error">{errors.team.size.message}</span>
          )}
        </label>
        <div className="field">
          <span>Perfis necessários</span>
          <div className="checkbox-list">
            {ROLE_OPTIONS.map((role) => (
              <label key={role.value}>
                <input type="checkbox" value={role.value} {...rolesRegister} />
                {role.label}
              </label>
            ))}
          </div>
          {errors.team?.roles && (
            <span className="error">{errors.team.roles.message as string}</span>
          )}
        </div>
      </ResponsiveGrid>
      <label className="field">
        <span>E-mails para convite inicial</span>
        <textarea
          {...register('team.inviteEmails')}
          rows={3}
          placeholder="Insira um e-mail por linha ou separados por vírgula"
        />
      </label>
      <FieldStyles />
    </Card>
  );
}

function ReadinessStep() {
  const {
    register,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext<OnboardingFormValues>();
  const { startTour, hasCompleted } = useGuidedTour();

  const manualSupportTour = watch('readiness.supportTourCompleted');
  const supportTourCompleted = hasCompleted('support-knowledge-base');
  const mergedSupportTour = supportTourCompleted || Boolean(manualSupportTour);

  useEffect(() => {
    if (supportTourCompleted) {
      setValue('readiness.supportTourCompleted', true, { shouldDirty: true });
    }
  }, [setValue, supportTourCompleted]);

  const sandboxField = register('readiness.sandboxValidated');
  const mfaField = register('readiness.mfaConfigured');
  const supportTourField = register('readiness.supportTourCompleted');

  return (
    <Card title="Checklist de prontidão">
      <div className="field">
        <label className="checkbox-inline">
          <input type="checkbox" {...sandboxField} />
          Sandbox do playbook validado pela equipa
        </label>
      </div>
      <div className="field">
        <label className="checkbox-inline">
          <input type="checkbox" {...mfaField} />
          MFA configurado para administradores
        </label>
      </div>
      <div className="field readiness-tour">
        <label className="checkbox-inline">
          <input
            type="checkbox"
            {...supportTourField}
            checked={mergedSupportTour}
            onChange={(event) => {
              supportTourField.onChange(event);
              setValue('readiness.supportTourCompleted', event.target.checked, { shouldDirty: true });
            }}
          />
          Tour guiado do centro de suporte concluído
        </label>
        <p className="helper" role="status" aria-live="polite">
          {mergedSupportTour
            ? 'O tour foi concluído e sincronizado com a checklist de prontidão.'
            : 'Execute o tour do centro de suporte para validar autoatendimento da equipa.'}
        </p>
        <button
          type="button"
          className="secondary"
          onClick={() => startTour('support-knowledge-base')}
        >
          Abrir tour do suporte
        </button>
      </div>
      <label className="field">
        <span>Notas adicionais de segurança</span>
        <textarea
          {...register('readiness.securityNotes')}
          rows={3}
          placeholder="Ex.: Integrar com diretório corporativo até final do mês"
        />
        {errors.readiness?.securityNotes && (
          <span className="error">{errors.readiness.securityNotes.message}</span>
        )}
      </label>
      <FieldStyles />
    </Card>
  );
}

function FieldStyles() {
  return (
    <style jsx>{`
      .field {
        display: grid;
        gap: var(--space-2);
      }
      .field span {
        font-weight: 600;
        color: var(--color-deep-blue);
      }
      input,
      select,
      textarea {
        border-radius: var(--radius-sm);
        border: 1px solid var(--color-neutral-4);
        padding: var(--space-2);
        font: inherit;
        width: 100%;
        background: var(--color-neutral-0);
      }
      textarea {
        resize: vertical;
      }
      .checkbox-list {
        display: grid;
        gap: var(--space-2);
      }
      .checkbox-inline {
        display: flex;
        align-items: center;
        gap: var(--space-2);
      }
      .readiness-tour {
        gap: var(--space-2);
      }
      .readiness-tour .helper {
        margin: 0;
        font-size: 0.875rem;
        color: var(--color-neutral-2);
      }
      .readiness-tour button {
        justify-self: start;
        padding: var(--space-1) var(--space-3);
      }
      .error {
        color: var(--color-coral);
        font-size: 0.875rem;
      }
    `}</style>
  );
}

function mapChannelLabel(value: string): string {
  const channel = CHANNEL_OPTIONS.find((option) => option.value === value);
  return channel ? channel.label : value;
}
