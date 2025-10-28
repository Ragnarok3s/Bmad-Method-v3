import { act, render, screen } from '@testing-library/react';
import { OfflineBanner } from '../OfflineBanner';
import { OfflineProvider } from '../OfflineContext';

describe('OfflineBanner', () => {
  beforeEach(() => {
    Object.defineProperty(window.navigator, 'onLine', {
      value: true,
      configurable: true
    });
  });

  it('não exibe nada enquanto a app não tiver histórico de offline', async () => {
    await act(async () => {
      render(
        <OfflineProvider>
          <OfflineBanner />
        </OfflineProvider>
      );
    });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('comunica estado offline e ações pendentes', async () => {
    await act(async () => {
      render(
        <OfflineProvider>
          <OfflineBanner />
        </OfflineProvider>
      );
    });

    await act(async () => {
      Object.defineProperty(window.navigator, 'onLine', {
        value: false,
        configurable: true
      });
      window.dispatchEvent(new Event('offline'));
    });

    const banner = screen.getByRole('status');
    expect(banner).toHaveTextContent('Você está offline');
  });
});
