'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/layout/SectionHeader';
import {
  clearOnboardingProgress,
  loadOnboardingProgress,
  saveOnboardingProgress,
  withUpdatedProgress
} from '@/lib/storage/onboarding-progress';
import { createWorkspace, Workspace } from '@/services/api/workspaces';
import { CoreApiError } from '@/services/api/housekeeping';

import type {
  OnboardingFormValues,
  OnboardingStepDefinition
} from './types';

interface OnboardingWizardContextValue {
  steps: OnboardingStepDefinition[];
  currentStep: number;
  goToStep: (step: number) => void;
  next: () => void;
  previous: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  complete: (values: OnboardingFormValues) => Promise<boolean>;
  isSubmitting: boolean;
  submitError: string | null;
  completedWorkspace: Workspace | null;
  reset: () => void;
}

const defaultValues: OnboardingFormValues = {
  workspace: {
    name: '',
    timezone: 'UTC',
    primaryUseCase: '',
    communicationChannel: 'slack',
    quarterlyGoal: ''
  },
  team: {
    size: null,
    roles: [],
    inviteEmails: ''
  },
  readiness: {
    sandboxValidated: true,
    mfaConfigured: true,
    securityNotes: ''
  }
};

const steps: OnboardingStepDefinition[] = [
  {
    id: 'workspace',
    title: '1 · Configuração inicial',
    description: 'Dados básicos, fuso horário e objetivos trimestrais.'
  },
  {
    id: 'team',
    title: '2 · Equipa e agentes',
    description: 'Tamanho da equipa, perfis necessários e convites.'
  },
  {
    id: 'readiness',
    title: '3 · Checklist de prontidão',
    description: 'Validar MFA, sandbox e notas de segurança.'
  }
];

const OnboardingWizardContext = createContext<OnboardingWizardContextValue | null>(
  null
);

export function useOnboardingWizard(): OnboardingWizardContextValue {
  const context = useContext(OnboardingWizardContext);
  if (!context) {
    throw new Error('useOnboardingWizard deve ser usado dentro de OnboardingLayout');
  }
  return context;
}

function mapFormToPayload(values: OnboardingFormValues) {
  const sanitize = (input: string) => input.trim();
  const emails = values.team.inviteEmails
    .split(/\r?\n|,/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
  const securityNotes = sanitize(values.readiness.securityNotes);

  return {
    name: sanitize(values.workspace.name),
    timezone: values.workspace.timezone,
    teamSize: Math.max(values.team.size ?? 0, 1),
    primaryUseCase: sanitize(values.workspace.primaryUseCase),
    communicationChannel: values.workspace.communicationChannel,
    quarterlyGoal: sanitize(values.workspace.quarterlyGoal),
    inviteEmails: emails,
    teamRoles: values.team.roles,
    enableSandbox: values.readiness.sandboxValidated,
    requireMfa: values.readiness.mfaConfigured,
    securityNotes: securityNotes.length > 0 ? securityNotes : null
  };
}

export default function OnboardingLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const form = useForm<OnboardingFormValues>({
    defaultValues,
    mode: 'onChange'
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [completedWorkspace, setCompletedWorkspace] = useState<Workspace | null>(
    null
  );

  useEffect(() => {
    const progress = loadOnboardingProgress();
    if (progress) {
      setCurrentStep(Math.min(progress.step, steps.length - 1));
      form.reset(progress.values);
    }
    setIsHydrated(true);
  }, [form]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    const subscription = form.watch((values) => {
      saveOnboardingProgress(
        withUpdatedProgress(currentStep, values as OnboardingFormValues)
      );
    });
    return () => subscription.unsubscribe();
  }, [form, currentStep, isHydrated]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    saveOnboardingProgress(
      withUpdatedProgress(currentStep, form.getValues() as OnboardingFormValues)
    );
  }, [currentStep, form, isHydrated]);

  const goToStep = useCallback((stepIndex: number) => {
    setCurrentStep((previous) => {
      const nextIndex = Math.max(0, Math.min(stepIndex, steps.length - 1));
      return nextIndex;
    });
  }, []);

  const next = useCallback(() => {
    setCurrentStep((previous) => Math.min(previous + 1, steps.length - 1));
  }, []);

  const previous = useCallback(() => {
    setCurrentStep((previous) => Math.max(previous - 1, 0));
  }, []);

  const reset = useCallback(() => {
    form.reset(defaultValues);
    setCurrentStep(0);
    setCompletedWorkspace(null);
    clearOnboardingProgress();
    setSubmitError(null);
  }, [form]);

  const complete = useCallback(
    async (values: OnboardingFormValues): Promise<boolean> => {
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        const workspace = await createWorkspace(mapFormToPayload(values));
        setCompletedWorkspace(workspace);
        clearOnboardingProgress();
        return true;
      } catch (error) {
        if (error instanceof CoreApiError) {
          const detail =
            typeof error.body === 'object' && error.body && 'detail' in error.body
              ? String((error.body as { detail?: unknown }).detail)
              : null;
          setSubmitError(
            detail ?? 'Não foi possível criar o workspace. Tente novamente.'
          );
        } else {
          setSubmitError('Ocorreu um erro inesperado. Tente novamente.');
        }
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const contextValue = useMemo<OnboardingWizardContextValue>(
    () => ({
      steps,
      currentStep,
      goToStep,
      next,
      previous,
      isFirstStep: currentStep === 0,
      isLastStep: currentStep === steps.length - 1,
      complete,
      isSubmitting,
      submitError,
      completedWorkspace,
      reset
    }),
    [
      complete,
      currentStep,
      goToStep,
      next,
      previous,
      submitError,
      isSubmitting,
      completedWorkspace,
      reset
    ]
  );

  const isCompleted = Boolean(completedWorkspace);

  return (
    <FormProvider {...form}>
      <OnboardingWizardContext.Provider value={contextValue}>
        <div className="onboarding-container">
          <SectionHeader subtitle="Wizard guiado conforme manual do usuário e roadmap BL-01">
            Onboarding de workspaces
          </SectionHeader>
          <Card>
            <ol className="wizard-steps">
              {steps.map((step, index) => {
                const statusClass = isCompleted
                  ? 'completed'
                  : index === currentStep
                  ? 'active'
                  : index < currentStep
                  ? 'completed'
                  : 'upcoming';
                return (
                  <li key={step.id} className={statusClass}>
                    <span className="step-index">{index + 1}</span>
                    <div>
                      <strong>{step.title}</strong>
                      <p>{step.description}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Card>
          {submitError && !isCompleted && (
            <Card accent="critical">
              <strong>Erro ao criar workspace</strong>
              <p>{submitError}</p>
            </Card>
          )}
          {children}
        </div>
      </OnboardingWizardContext.Provider>
      <style jsx>{`
        .onboarding-container {
          display: grid;
          gap: var(--space-5);
        }
        .wizard-steps {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: var(--space-4);
        }
        .wizard-steps li {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: var(--space-4);
          align-items: start;
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-neutral-4);
          background: var(--color-neutral-6);
        }
        .wizard-steps li.active {
          border-color: var(--color-deep-blue);
          background: rgba(28, 76, 153, 0.08);
        }
        .wizard-steps li.completed {
          border-color: var(--color-soft-aqua);
          background: rgba(0, 170, 181, 0.08);
        }
        .wizard-steps .step-index {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 999px;
          background: var(--color-neutral-5);
          font-weight: 600;
          color: var(--color-deep-blue);
        }
        .wizard-steps li.active .step-index {
          background: var(--color-deep-blue);
          color: #fff;
        }
        .wizard-steps li.completed .step-index {
          background: var(--color-soft-aqua);
          color: var(--color-deep-blue);
        }
        .wizard-steps p {
          margin: var(--space-1) 0 0;
          color: var(--color-neutral-2);
        }
        @media (max-width: 768px) {
          .wizard-steps li {
            grid-template-columns: 1fr;
            gap: var(--space-2);
          }
          .wizard-steps .step-index {
            width: 2rem;
            height: 2rem;
          }
        }
      `}</style>
    </FormProvider>
  );
}
