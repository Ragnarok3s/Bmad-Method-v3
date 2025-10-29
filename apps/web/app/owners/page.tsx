'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { SectionHeader } from '@/components/layout/SectionHeader';
import {
  fetchOwnerNotifications,
  fetchOwnerOverview,
  OwnerNotification,
  OwnerOverview,
  OwnerPayoutPreferencesInput,
  resolveOwnerToken,
  updateOwnerPayoutPreferences,
  uploadOwnerDocument
} from '@/services/api/owners';
import { useOwnerAccess } from './OwnerAccessContext';

const currencyFormatter = new Intl.NumberFormat('pt-PT', {
  style: 'currency',
  currency: 'EUR'
});

const percentFormatter = new Intl.NumberFormat('pt-PT', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

export default function OwnersOverviewPage() {
  const { ownerId, token } = useOwnerAccess();
  const [overview, setOverview] = useState<OwnerOverview | null>(null);
  const [notifications, setNotifications] = useState<OwnerNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState('identidade');
  const resolvedToken = useMemo(() => resolveOwnerToken(token), [token]);

  const [payoutForm, setPayoutForm] = useState<OwnerPayoutPreferencesInput | null>(null);

  useEffect(() => {
    const abort = new AbortController();
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [overviewData, notificationData] = await Promise.all([
          fetchOwnerOverview(ownerId, resolvedToken),
          fetchOwnerNotifications(ownerId, resolvedToken)
        ]);
        if (!abort.signal.aborted) {
          setOverview(overviewData);
          setNotifications(notificationData);
        }
      } catch (err) {
        if (!abort.signal.aborted) {
          setError('Falha ao carregar dados do proprietário. Utilize o suporte para obter ajuda.');
        }
      } finally {
        if (!abort.signal.aborted) {
          setLoading(false);
        }
      }
    }
    load();
    return () => abort.abort();
  }, [ownerId, resolvedToken]);

  useEffect(() => {
    if (overview) {
      setPayoutForm({
        method: overview.payoutPreferences.method,
        beneficiaryName: overview.payoutPreferences.beneficiaryName,
        bankAccountLast4: overview.payoutPreferences.bankAccountLast4,
        currency: overview.payoutPreferences.currency,
        payoutThreshold: overview.payoutPreferences.payoutThreshold,
        schedule: overview.payoutPreferences.schedule
      });
    }
  }, [overview]);

  const handlePayoutChange = (field: keyof OwnerPayoutPreferencesInput, value: string) => {
    setPayoutForm((prev) => {
      if (!prev) {
        return prev;
      }
      if (field === 'payoutThreshold') {
        return { ...prev, payoutThreshold: Number(value) };
      }
      if (field === 'bankAccountLast4') {
        return { ...prev, bankAccountLast4: value };
      }
      return { ...prev, [field]: value } as OwnerPayoutPreferencesInput;
    });
  };

  const handlePayoutSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!payoutForm) {
      return;
    }
    try {
      setFeedback(null);
      setError(null);
      const updated = await updateOwnerPayoutPreferences(ownerId, resolvedToken, payoutForm);
      setOverview((current) =>
        current
          ? {
              ...current,
              payoutPreferences: updated,
              pendingVerifications: updated.manualReviewRequired
                ? current.pendingVerifications + 1
                : current.pendingVerifications,
              complianceStatus: updated.manualReviewRequired ? 'pending' : current.complianceStatus
            }
          : current
      );
      const notificationData = await fetchOwnerNotifications(ownerId, resolvedToken);
      setNotifications(notificationData);
      setFeedback('Preferências de pagamento actualizadas com sucesso.');
    } catch (err) {
      setError('Não foi possível actualizar preferências de pagamento neste momento.');
    }
  };

  const handleDocumentUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fileInput = form.elements.namedItem('documento') as HTMLInputElement | null;
    const file = fileInput?.files?.[0];
    if (!file) {
      setUploadFeedback('Selecione um documento válido antes de enviar.');
      return;
    }
    try {
      setUploadFeedback(null);
      await uploadOwnerDocument(ownerId, resolvedToken, file, documentType);
      const [overviewData, notificationData] = await Promise.all([
        fetchOwnerOverview(ownerId, resolvedToken),
        fetchOwnerNotifications(ownerId, resolvedToken)
      ]);
      setOverview(overviewData);
      setNotifications(notificationData);
      form.reset();
      setUploadFeedback('Documento submetido e encaminhado para verificação manual.');
    } catch (err) {
      setUploadFeedback('Falha ao submeter documento. Tente novamente.');
    }
  };

  return (
    <div className="owners-overview">
      <SectionHeader subtitle="Indicadores financeiros e operacionais actualizados a cada 15 minutos">
        Overview financeiro do proprietário
      </SectionHeader>
      {error && <p className="owners-error" role="alert">{error}</p>}
      {loading && <p className="owners-loading">A carregar dados consolidados…</p>}
      {!loading && overview && (
        <>
          <ResponsiveGrid columns={3}>
            <Card title="Taxa de ocupação" description="Últimos 30 dias" accent="info">
              <p className="owners-metric" data-testid="owner-overview-metric-occupancy">
                {percentFormatter.format(overview.metrics.occupancyRate)}
              </p>
              <p className="owners-muted">
                {overview.metrics.propertiesActive} propriedades activas
              </p>
            </Card>
            <Card title="Receita acumulada" description="Mês corrente" accent="success">
              <p className="owners-metric" data-testid="owner-overview-metric-revenue">
                {currencyFormatter.format(overview.metrics.revenueMtd)}
              </p>
              <p className="owners-muted">
                ADR médio {currencyFormatter.format(overview.metrics.averageDailyRate)}
              </p>
            </Card>
            <Card title="Compliance" description="Revisões KYC e auditorias" accent="warning">
              <p className="owners-metric" data-testid="owner-overview-metric-compliance">
                {overview.complianceStatus === 'clear' ? 'Em conformidade' : 'Revisão pendente'}
              </p>
              <p className="owners-muted">
                {overview.pendingVerifications} verificações por concluir · {overview.documentsSubmitted} documentos entregues
              </p>
            </Card>
          </ResponsiveGrid>

          <div className="owners-panels">
            <Card title="Preferências de pagamento" description="Actualize dados bancários e frequência de liquidação.">
              {feedback && (
                <p className="owners-feedback" data-testid="owner-update-feedback">
                  {feedback}
                </p>
              )}
              <form className="owners-form" onSubmit={handlePayoutSubmit}>
                <label htmlFor="beneficiary">Beneficiário</label>
                <input
                  id="beneficiary"
                  name="beneficiary"
                  value={payoutForm?.beneficiaryName ?? ''}
                  onChange={(event) => handlePayoutChange('beneficiaryName', event.target.value)}
                  required
                />
                <label htmlFor="method">Método</label>
                <select
                  id="method"
                  name="method"
                  value={payoutForm?.method ?? 'bank_transfer'}
                  onChange={(event) => handlePayoutChange('method', event.target.value)}
                  data-testid="owner-payout-method"
                >
                  <option value="bank_transfer">Transferência bancária</option>
                  <option value="pix">PIX (Brasil)</option>
                  <option value="paypal">PayPal</option>
                </select>
                <label htmlFor="iban">Últimos 4 dígitos da conta</label>
                <input
                  id="iban"
                  name="iban"
                  value={payoutForm?.bankAccountLast4 ?? ''}
                  onChange={(event) => handlePayoutChange('bankAccountLast4', event.target.value)}
                  inputMode="numeric"
                  pattern="[0-9]{0,4}"
                  placeholder="1234"
                />
                <label htmlFor="currency">Moeda</label>
                <input
                  id="currency"
                  name="currency"
                  value={payoutForm?.currency ?? 'EUR'}
                  onChange={(event) => handlePayoutChange('currency', event.target.value)}
                />
                <label htmlFor="threshold">Valor mínimo por pagamento</label>
                <input
                  id="threshold"
                  name="threshold"
                  type="number"
                  min={0}
                  step={50}
                  value={payoutForm?.payoutThreshold ?? 0}
                  onChange={(event) => handlePayoutChange('payoutThreshold', event.target.value)}
                />
                <label htmlFor="schedule">Periodicidade</label>
                <select
                  id="schedule"
                  name="schedule"
                  value={payoutForm?.schedule ?? 'monthly'}
                  onChange={(event) => handlePayoutChange('schedule', event.target.value)}
                >
                  <option value="monthly">Mensal</option>
                  <option value="weekly">Semanal</option>
                </select>
                <button type="submit">Guardar preferências</button>
              </form>
            </Card>

            <Card
              title="Documentos de verificação"
              description="Envie contratos sociais, comprovativos bancários ou identidade."
            >
              <form className="owners-form" onSubmit={handleDocumentUpload}>
                <label htmlFor="document-type">Tipo de documento</label>
                <select
                  id="document-type"
                  value={documentType}
                  onChange={(event) => setDocumentType(event.target.value)}
                >
                  <option value="identidade">Identidade</option>
                  <option value="comprovativo-bancario">Comprovativo bancário</option>
                  <option value="contrato-social">Contrato social</option>
                </select>
                <label htmlFor="documento">Ficheiro</label>
                <input id="documento" name="documento" type="file" accept="application/pdf,image/*" />
                <button type="submit">Submeter documento</button>
              </form>
              {uploadFeedback && (
                <p className="owners-feedback" data-testid="owner-document-upload-feedback">
                  {uploadFeedback}
                </p>
              )}
            </Card>
          </div>

          <Card title="Alertas e notificações" description="Eventos mais recentes do portal do proprietário.">
            <ul className="owners-notifications" data-testid="owner-notifications-list">
              {notifications.length === 0 && <li>Nenhuma notificação no momento.</li>}
              {notifications.map((item) => (
                <li key={item.id} data-read={item.read}>
                  <p className="owners-notification-title">{item.title}</p>
                  <p className="owners-notification-message">{item.message}</p>
                  <p className="owners-notification-meta">
                    {new Date(item.createdAt).toLocaleString('pt-PT')} · {item.category}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}
      <style jsx>{`
        .owners-overview {
          display: grid;
          gap: var(--space-5);
        }
        .owners-error {
          color: var(--color-coral);
          margin: 0;
        }
        .owners-loading {
          color: var(--color-neutral-2);
        }
        .owners-metric {
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
        }
        .owners-muted {
          margin: 0;
          color: var(--color-neutral-2);
        }
        .owners-panels {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: var(--space-4);
        }
        .owners-form {
          display: grid;
          gap: var(--space-3);
        }
        .owners-form input,
        .owners-form select {
          border: 1px solid rgba(11, 60, 93, 0.2);
          border-radius: var(--radius-sm);
          padding: var(--space-3) var(--space-4);
          font-size: 1rem;
        }
        .owners-form button {
          border: none;
          border-radius: var(--radius-sm);
          padding: var(--space-3) var(--space-4);
          background: var(--color-deep-blue);
          color: #fff;
          font-weight: 600;
          cursor: pointer;
        }
        .owners-feedback {
          margin: 0;
          color: var(--color-deep-blue);
          font-weight: 600;
        }
        .owners-notifications {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: var(--space-3);
        }
        .owners-notifications li {
          border: 1px solid rgba(11, 60, 93, 0.12);
          border-radius: var(--radius-sm);
          padding: var(--space-3) var(--space-4);
          background: rgba(11, 60, 93, 0.04);
        }
        .owners-notifications li[data-read='false'] {
          border-color: rgba(46, 196, 182, 0.6);
          background: rgba(46, 196, 182, 0.12);
        }
        .owners-notification-title {
          margin: 0;
          font-weight: 600;
        }
        .owners-notification-message {
          margin: var(--space-2) 0;
        }
        .owners-notification-meta {
          margin: 0;
          font-size: 0.875rem;
          color: var(--color-neutral-2);
        }
        @media (max-width: 960px) {
          .owners-panels {
            grid-template-columns: minmax(0, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
