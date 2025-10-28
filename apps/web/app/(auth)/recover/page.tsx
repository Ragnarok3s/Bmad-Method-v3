'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

import { Card } from '@/components/ui/Card';
import { CoreApiError } from '@/services/api/housekeeping';
import {
  completeRecovery,
  initiateRecovery,
  LoginResult,
  RecoveryInitiation
} from '@/services/api/auth';

export default function RecoveryPage() {
  const [initError, setInitError] = useState<string | null>(null);
  const [completionError, setCompletionError] = useState<string | null>(null);
  const [initResult, setInitResult] = useState<RecoveryInitiation | null>(null);
  const [completionResult, setCompletionResult] = useState<LoginResult | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  async function handleInitiate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '').trim();
    if (!email) {
      setInitError('Informe o email associado ao agente.');
      return;
    }
    setIsRequesting(true);
    setInitError(null);
    setInitResult(null);
    try {
      const result = await initiateRecovery(email);
      setInitResult(result);
    } catch (apiError) {
      if (apiError instanceof CoreApiError) {
        const detail = (apiError.body as Record<string, any>)?.detail;
        setInitError(typeof detail === 'string' ? detail : 'Não foi possível gerar novos códigos.');
      } else {
        setInitError('Falha inesperada ao contactar a API.');
      }
    } finally {
      setIsRequesting(false);
    }
  }

  async function handleComplete(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '').trim();
    const code = String(form.get('code') ?? '').trim();
    if (!email || !code) {
      setCompletionError('Informe email e código de recuperação.');
      return;
    }
    setIsCompleting(true);
    setCompletionError(null);
    setCompletionResult(null);
    try {
      const result = await completeRecovery({ email, code });
      setCompletionResult(result);
    } catch (apiError) {
      if (apiError instanceof CoreApiError) {
        const detail = (apiError.body as Record<string, any>)?.detail;
        setCompletionError(typeof detail === 'string' ? detail : 'Código inválido ou expirado.');
      } else {
        setCompletionError('Não foi possível concluir a recuperação.');
      }
    } finally {
      setIsCompleting(false);
    }
  }

  return (
    <div className="recovery-grid">
      <Card
        title="Gerar novos códigos"
        description="Produz um novo conjunto de códigos de recuperação com validade imediata."
      >
        <form className="auth-form" onSubmit={handleInitiate}>
          <label className="field">
            <span>Email do agente</span>
            <input type="email" name="email" required />
          </label>
          {initError && (
            <p role="alert" className="feedback error">
              {initError}
            </p>
          )}
          {initResult && (
            <div className="recovery-codes" aria-live="polite">
              <p>
                Guardar estes códigos num local seguro. Emitidos em{' '}
                {new Date(initResult.issuedAt).toLocaleString('pt-PT')}.
              </p>
              <ul>
                {initResult.recoveryCodes.map((item) => (
                  <li key={item}>
                    <code>{item}</code>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button type="submit" className="primary" disabled={isRequesting}>
            {isRequesting ? 'Gerando…' : 'Gerar códigos'}
          </button>
        </form>
      </Card>
      <Card
        title="Concluir recuperação"
        description="Use um dos códigos emitidos para criar uma sessão autenticada."
      >
        <form className="auth-form" onSubmit={handleComplete}>
          <label className="field">
            <span>Email do agente</span>
            <input type="email" name="email" required />
          </label>
          <label className="field">
            <span>Código de recuperação</span>
            <input name="code" placeholder="ABCDE-12345" required />
          </label>
          {completionError && (
            <p role="alert" className="feedback error">
              {completionError}
            </p>
          )}
          {completionResult && (
            <p className="feedback success">
              Recuperação concluída. <Link href="/login">Regresse ao login</Link> para iniciar
              uma nova sessão.
            </p>
          )}
          <button type="submit" className="primary" disabled={isCompleting}>
            {isCompleting ? 'Validando…' : 'Concluir recuperação'}
          </button>
        </form>
      </Card>
      <style jsx>{`
        .recovery-grid {
          display: grid;
          gap: var(--space-4);
        }
        @media (min-width: 960px) {
          .recovery-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
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
        .recovery-codes {
          background: rgba(46, 196, 182, 0.12);
          border-radius: var(--radius-sm);
          padding: var(--space-3);
          display: grid;
          gap: var(--space-2);
        }
        .recovery-codes ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: var(--space-2);
        }
        code {
          font-weight: 600;
          letter-spacing: 0.2em;
        }
      `}</style>
    </div>
  );
}
