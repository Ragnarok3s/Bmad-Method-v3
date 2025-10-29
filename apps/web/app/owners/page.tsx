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
import { useTranslation } from '@/lib/i18n';

export default function OwnersOverviewPage() {
  const { ownerId, token } = useOwnerAccess();
  const { t, locale } = useTranslation('owners.overview');
  const [overview, setOverview] = useState<OwnerOverview | null>(null);
  const [notifications, setNotifications] = useState<OwnerNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState('identidade');
  const resolvedToken = useMemo(() => resolveOwnerToken(token), [token]);

  const [payoutForm, setPayoutForm] = useState<OwnerPayoutPreferencesInput | null>(null);
  const metricsCurrency = overview?.payoutPreferences.currency ?? 'EUR';
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: metricsCurrency
      }),
    [locale, metricsCurrency]
  );
  const percentFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }),
    [locale]
  );
  const integerFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);

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
          setError(t('errors.loadFailed'));
        }
      } finally {
        if (!abort.signal.aborted) {
          setLoading(false);
        }
      }
    }
    load();
    return () => abort.abort();
  }, [ownerId, resolvedToken, t]);

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
      setFeedback(t('cards.payout.success'));
    } catch (err) {
      setError(t('errors.updateFailed'));
    }
  };

  const handleDocumentUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fileInput = form.elements.namedItem('documento') as HTMLInputElement | null;
    const file = fileInput?.files?.[0];
    if (!file) {
      setUploadFeedback(t('errors.uploadMissing'));
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
      setUploadFeedback(t('cards.documents.success'));
    } catch (err) {
      setUploadFeedback(t('errors.uploadFailed'));
    }
  };

  return (
    <div className="owners-overview">
      <SectionHeader subtitle={t('section.subtitle')}>
        {t('section.title')}
      </SectionHeader>
      {error && <p className="owners-error" role="alert">{error}</p>}
      {loading && <p className="owners-loading">{t('loading')}</p>}
      {!loading && overview && (
        <>
          <ResponsiveGrid columns={3}>
            <Card
              title={t('cards.occupancy.title')}
              description={t('cards.occupancy.description')}
              accent="info"
            >
              <p className="owners-metric" data-testid="owner-overview-metric-occupancy">
                {percentFormatter.format(overview.metrics.occupancyRate)}
              </p>
              <p className="owners-muted">
                {t('cards.occupancy.properties', {
                  count: integerFormatter.format(overview.metrics.propertiesActive)
                })}
              </p>
            </Card>
            <Card
              title={t('cards.revenue.title')}
              description={t('cards.revenue.description')}
              accent="success"
            >
              <p className="owners-metric" data-testid="owner-overview-metric-revenue">
                {currencyFormatter.format(overview.metrics.revenueMtd)}
              </p>
              <p className="owners-muted">
                {t('cards.revenue.adr', {
                  value: currencyFormatter.format(overview.metrics.averageDailyRate)
                })}
              </p>
            </Card>
            <Card
              title={t('cards.compliance.title')}
              description={t('cards.compliance.description')}
              accent="warning"
            >
              <p className="owners-metric" data-testid="owner-overview-metric-compliance">
                {overview.complianceStatus === 'clear'
                  ? t('cards.compliance.clear')
                  : t('cards.compliance.pending')}
              </p>
              <p className="owners-muted">
                {t('cards.compliance.summary', {
                  pending: integerFormatter.format(overview.pendingVerifications),
                  documents: integerFormatter.format(overview.documentsSubmitted)
                })}
              </p>
            </Card>
          </ResponsiveGrid>

          <div className="owners-panels">
            <Card
              title={t('cards.payout.title')}
              description={t('cards.payout.description')}
            >
              {feedback && (
                <p className="owners-feedback" data-testid="owner-update-feedback">
                  {feedback}
                </p>
              )}
              <form className="owners-form" onSubmit={handlePayoutSubmit}>
                <label htmlFor="beneficiary">{t('cards.payout.labels.beneficiary')}</label>
                <input
                  id="beneficiary"
                  name="beneficiary"
                  value={payoutForm?.beneficiaryName ?? ''}
                  onChange={(event) => handlePayoutChange('beneficiaryName', event.target.value)}
                  required
                />
                <label htmlFor="method">{t('cards.payout.labels.method')}</label>
                <select
                  id="method"
                  name="method"
                  value={payoutForm?.method ?? 'bank_transfer'}
                  onChange={(event) => handlePayoutChange('method', event.target.value)}
                  data-testid="owner-payout-method"
                >
                  <option value="bank_transfer">{t('cards.payout.options.bank_transfer')}</option>
                  <option value="pix">{t('cards.payout.options.pix')}</option>
                  <option value="paypal">{t('cards.payout.options.paypal')}</option>
                </select>
                <label htmlFor="iban">{t('cards.payout.labels.lastDigits')}</label>
                <input
                  id="iban"
                  name="iban"
                  value={payoutForm?.bankAccountLast4 ?? ''}
                  onChange={(event) => handlePayoutChange('bankAccountLast4', event.target.value)}
                  inputMode="numeric"
                  pattern="[0-9]{0,4}"
                  placeholder="1234"
                />
                <label htmlFor="currency">{t('cards.payout.labels.currency')}</label>
                <input
                  id="currency"
                  name="currency"
                  value={payoutForm?.currency ?? 'EUR'}
                  onChange={(event) => handlePayoutChange('currency', event.target.value)}
                />
                <label htmlFor="threshold">{t('cards.payout.labels.threshold')}</label>
                <input
                  id="threshold"
                  name="threshold"
                  type="number"
                  min={0}
                  step={50}
                  value={payoutForm?.payoutThreshold ?? 0}
                  onChange={(event) => handlePayoutChange('payoutThreshold', event.target.value)}
                />
                <label htmlFor="schedule">{t('cards.payout.labels.schedule')}</label>
                <select
                  id="schedule"
                  name="schedule"
                  value={payoutForm?.schedule ?? 'monthly'}
                  onChange={(event) => handlePayoutChange('schedule', event.target.value)}
                >
                  <option value="monthly">{t('cards.payout.options.monthly')}</option>
                  <option value="weekly">{t('cards.payout.options.weekly')}</option>
                </select>
                <button type="submit">{t('cards.payout.submit')}</button>
              </form>
            </Card>

            <Card
              title={t('cards.documents.title')}
              description={t('cards.documents.description')}
            >
              <form className="owners-form" onSubmit={handleDocumentUpload}>
                <label htmlFor="document-type">{t('cards.documents.labels.type')}</label>
                <select
                  id="document-type"
                  value={documentType}
                  onChange={(event) => setDocumentType(event.target.value)}
                >
                  <option value="identidade">{t('cards.documents.options.identidade')}</option>
                  <option value="comprovativo-bancario">{t('cards.documents.options.comprovativo-bancario')}</option>
                  <option value="contrato-social">{t('cards.documents.options.contrato-social')}</option>
                </select>
                <label htmlFor="documento">{t('cards.documents.labels.file')}</label>
                <input id="documento" name="documento" type="file" accept="application/pdf,image/*" />
                <button type="submit">{t('cards.documents.submit')}</button>
              </form>
              {uploadFeedback && (
                <p className="owners-feedback" data-testid="owner-document-upload-feedback">
                  {uploadFeedback}
                </p>
              )}
            </Card>
          </div>

          <Card
            title={t('cards.notifications.title')}
            description={t('cards.notifications.description')}
          >
            <ul className="owners-notifications" data-testid="owner-notifications-list">
              {notifications.length === 0 && <li>{t('cards.notifications.empty')}</li>}
              {notifications.map((item) => (
                <li key={item.id} data-read={item.read}>
                  <p className="owners-notification-title">{item.title}</p>
                  <p className="owners-notification-message">{item.message}</p>
                  <p className="owners-notification-meta">
                    {t('cards.notifications.meta', {
                      timestamp: new Date(item.createdAt).toLocaleString(locale),
                      category: item.category
                    })}
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
