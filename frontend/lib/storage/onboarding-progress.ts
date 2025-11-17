import { OnboardingFormValues, OnboardingProgress } from '@/app/onboarding/types';

const STORAGE_KEY = 'bmad:onboarding:progress';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadOnboardingProgress(): OnboardingProgress | null {
  if (!isBrowser()) {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as OnboardingProgress;
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }
    return parsed;
  } catch (error) {
    console.warn('onboarding_progress_parse_failed', error);
    return null;
  }
}

export function saveOnboardingProgress(progress: OnboardingProgress): void {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.warn('onboarding_progress_save_failed', error);
  }
}

export function clearOnboardingProgress(): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

export function withUpdatedProgress(
  step: number,
  values: OnboardingFormValues
): OnboardingProgress {
  return {
    step,
    values,
    updatedAt: new Date().toISOString()
  };
}
