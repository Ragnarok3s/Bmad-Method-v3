export type CommunicationChannel = 'slack' | 'email' | 'teams' | 'other';

export interface OnboardingFormValues {
  workspace: {
    name: string;
    timezone: string;
    primaryUseCase: string;
    communicationChannel: CommunicationChannel;
    quarterlyGoal: string;
  };
  team: {
    size: number | null;
    roles: string[];
    inviteEmails: string;
  };
  readiness: {
    sandboxValidated: boolean;
    mfaConfigured: boolean;
    securityNotes: string;
  };
}

export interface OnboardingProgress {
  step: number;
  values: OnboardingFormValues;
  updatedAt: string;
}

export interface OnboardingStepDefinition {
  id: string;
  title: string;
  description: string;
}
