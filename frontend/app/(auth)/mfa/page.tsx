'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useCallback, useMemo, useState } from 'react';

import { Card } from '@/components/ui/Card';
import { CoreApiError } from '@/services/api/housekeeping';
import { verifyMfa } from '@/services/api/auth';
import { useTranslation } from '@/lib/i18n';

export default function MfaPage() {
  const search = useSearchParams();
  const router = useRouter();
  const sessionId = useMemo(() => search.get('sessionId') ?? '', [search]);
  const [method, setMethod] = useState<'totp' | 'recovery'>('totp');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { t } = useTranslation('auth.mfa');
  const methods = useMemo(
    () => [
      { value: 'totp' as const, label: t('methods.totp') },
      { value: 'recovery' as const, label: t('methods.recovery') }
    ],
    [t]
  );
  const renderLinkedCopy = useCallback(
    (template: string, href: string) => {
      const segments = template.split(/<link>|<\/link>/g);
      if (segments.length < 3) {
        return template;
      }
      const [prefix, anchor, suffix] = segments as [string, string, string];
      return (
        <>
          {prefix}
          <Link href={href}>{anchor}</Link>
          {suffix}
        </>
      );
    },
    []
  );

  if (!sessionId) {
    return (
      <Card title={t('invalidSessionTitle')} description={t('invalidSessionDescription')}>
        <p>{renderLinkedCopy(t('invalidSessionBody'), '/login')}</p>
      </Card>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const code = String(form.get('code') ?? '').trim();
    if (!code) {
      setError(t('errors.missingCode'));
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await verifyMfa({ sessionId, code, method });
      setSuccess(t('success.confirmed'));
      router.prefetch('/');
    } catch (apiError) {
      if (apiError instanceof CoreApiError) {
        const detail = (apiError.body as Record<string, any>)?.detail;
        if (typeof detail === 'string') {
          setError(detail);
        } else {
          setError(t('errors.invalidCode'));
        }
      } else {
        setError(t('errors.unexpected'));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card title={t('cardTitle')} description={t('cardDescription')}>
      <form className="auth-form" onSubmit={handleSubmit}>
        <fieldset className="method">
          <legend>{t('methodLegend')}</legend>
          {methods.map((item) => (
            <label key={item.value} className="option">
              <input
                type="radio"
                name="method"
                value={item.value}
                checked={method === item.value}
                onChange={() => setMethod(item.value)}
              />
              {item.label}
            </label>
          ))}
        </fieldset>
        <label className="field">
          <span>
            {method === 'totp' ? t('methods.totp') : t('methods.recovery')}
          </span>
          <input
            name="code"
            inputMode="numeric"
            pattern="[0-9A-Za-z-]{6,}"
            placeholder={
              method === 'totp' ? t('placeholders.totp') : t('placeholders.recovery')
            }
            required
          />
        </label>
        {error && (
          <p role="alert" className="feedback error">
            {error}
          </p>
        )}
        {success && <p className="feedback success">{success}</p>}
        <button type="submit" className="primary" disabled={isSubmitting}>
          {isSubmitting ? t('actions.submitting') : t('actions.submit')}
        </button>
        <p className="aux">
          {t('links.needNewCodes')}{' '}
          <Link href="/recover">{t('links.recover')}</Link>
        </p>
      </form>
      <style jsx>{`
        .auth-form {
          display: grid;
          gap: var(--space-4);
        }
        .method {
          border: 1px solid var(--color-neutral-6);
          border-radius: var(--radius-sm);
          padding: var(--space-3);
          display: grid;
          gap: var(--space-2);
        }
        .option {
          display: flex;
          gap: var(--space-2);
          align-items: center;
          font-size: 0.95rem;
        }
        .field {
          display: grid;
          gap: var(--space-2);
        }
        input[type='radio'] {
          accent-color: var(--color-deep-blue);
        }
        input[name='code'] {
          border: 1px solid var(--color-neutral-5);
          border-radius: var(--radius-sm);
          padding: var(--space-2) var(--space-3);
          font-size: 1rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
        .primary {
          background: var(--color-deep-blue);
          color: #fff;
          border: none;
          padding: var(--space-3);
          border-radius: var(--radius-sm);
          font-weight: 600;
          cursor: pointer;
        }
        .primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .feedback {
          margin: 0;
          font-size: 0.95rem;
        }
        .feedback.error {
          color: #b00020;
        }
        .feedback.success {
          color: var(--color-success, #0f7b6c);
        }
        .aux {
          margin: 0;
          font-size: 0.9rem;
          color: var(--color-neutral-9);
        }
        .aux a {
          color: var(--color-deep-blue);
          font-weight: 600;
        }
      `}</style>
    </Card>
  );
}
