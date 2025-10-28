'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import { Card } from '@/components/ui/Card';
import { CoreApiError } from '@/services/api/housekeeping';
import { login, LoginResult } from '@/services/api/auth';

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LoginResult | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '');

    if (!email || !password) {
      setError('Informe email e palavra-passe.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await login({ email, password });
      setResult(response);
      if (response.mfaRequired) {
        router.push(`/mfa?sessionId=${encodeURIComponent(response.sessionId)}`);
      }
    } catch (apiError) {
      if (apiError instanceof CoreApiError) {
        const detail = (apiError.body as Record<string, any>)?.detail;
        if (typeof detail === 'string') {
          setError(detail);
        } else if (detail && typeof detail === 'object' && 'message' in detail) {
          setError(String(detail.message));
        } else {
          setError('Falha na autenticação. Verifique as credenciais.');
        }
      } else {
        setError('Erro inesperado ao contactar a API.');
      }
      setResult(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card title="Autenticação" description="Aceda à plataforma com MFA reforçado.">
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <label className="field">
          <span>Email corporativo</span>
          <input type="email" name="email" autoComplete="username" required />
        </label>
        <label className="field">
          <span>Palavra-passe</span>
          <input type="password" name="password" autoComplete="current-password" required />
        </label>
        {error && (
          <p role="alert" className="feedback error">
            {error}
          </p>
        )}
        {result && !result.mfaRequired && (
          <p className="feedback success">
            Sessão iniciada para o agente #{result.agentId}. Expira em{' '}
            {Math.round(result.sessionTimeoutSeconds / 60)} minutos.
          </p>
        )}
        <button type="submit" className="primary" disabled={isSubmitting}>
          {isSubmitting ? 'A validar…' : 'Entrar'}
        </button>
        <p className="aux">
          Perdeu acesso ao segundo fator?{' '}
          <Link href="/recover">Inicie a recuperação</Link>
        </p>
      </form>
      <style jsx>{`
        .auth-form {
          display: grid;
          gap: var(--space-4);
        }
        .field {
          display: grid;
          gap: var(--space-2);
        }
        input {
          border: 1px solid var(--color-neutral-5);
          border-radius: var(--radius-sm);
          padding: var(--space-2) var(--space-3);
          font-size: 1rem;
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
