import { render, screen, waitFor } from '@testing-library/react';
import { OfflineBanner } from '../OfflineBanner';
import { OfflineProvider } from '../OfflineContext';

describe('OfflineBanner', () => {
  beforeEach(() => {
    Object.defineProperty(window.navigator, 'onLine', {
      value: true,
      configurable: true
    });
  });

  it('não exibe nada enquanto a app não tiver histórico de offline', () => {
    render(
      <OfflineProvider>
        <OfflineBanner />
      </OfflineProvider>
    );
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('comunica estado offline e ações pendentes', async () => {
    render(
      <OfflineProvider>
        <OfflineBanner />
      </OfflineProvider>
    );

    Object.defineProperty(window.navigator, 'onLine', {
      value: false,
      configurable: true
    });
    window.dispatchEvent(new Event('offline'));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Você está offline');
    });
  });
});
