'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';

import { Card } from '@/components/ui/Card';
import { CoreApiError } from '@/services/api/housekeeping';
import { verifyMfa } from '@/services/api/auth';

const METHODS: Array<{ value: 'totp' | 'recovery'; label: string }> = [
  { value: 'totp', label: 'Código do autenticador' },
  { value: 'recovery', label: 'Código de recuperação' }
];

export default function MfaPage() {
  const search = useSearchParams();
  const router = useRouter();
  const sessionId = useMemo(() => search.get('sessionId') ?? '', [search]);
  const [method, setMethod] = useState<'totp' | 'recovery'>('totp');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!sessionId) {
    return (
      <Card title="Validação MFA" description="Sessão inválida">
        <p>
          Não recebemos um identificador de sessão válido. Regresse ao{' '}
          <Link href="/login">ecrã de login</Link> para reiniciar o processo.
        </p>
      </Card>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const code = String(form.get('code') ?? '').trim();
    if (!code) {
      setError('Informe o código enviado pelo autenticador ou recovery.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await verifyMfa({ sessionId, code, method });
      setSuccess('MFA confirmado com sucesso. Está pronto para avançar.');
      router.prefetch('/');
    } catch (apiError) {
      if (apiError instanceof CoreApiError) {
        const detail = (apiError.body as Record<string, any>)?.detail;
        if (typeof detail === 'string') {
          setError(detail);
        } else {
          setError('Código inválido. Tente novamente.');
        }
      } else {
        setError('Não foi possível validar o MFA.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card
      title="Validar segundo fator"
      description="Introduza o código de 6 dígitos ou utilize um código de recuperação."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <fieldset className="method">
          <legend>Método</legend>
          {METHODS.map((item) => (
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
          <span>{method === 'totp' ? 'Código do autenticador' : 'Código de recuperação'}</span>
          <input
            name="code"
            inputMode="numeric"
            pattern="[0-9A-Za-z-]{6,}" 
            placeholder={method === 'totp' ? '000000' : 'ABCDE-12345'}
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
          {isSubmitting ? 'A validar…' : 'Confirmar MFA'}
        </button>
        <p className="aux">
          Precisa de novos códigos? <Link href="/recover">Solicitar recuperação</Link>
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
