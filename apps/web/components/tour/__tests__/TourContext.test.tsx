import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { GuidedTourProvider, useGuidedTour } from '../TourContext';
import { usePageTour } from '../usePageTour';

let currentPath = '/';

jest.mock('next/navigation', () => ({
  __esModule: true,
  usePathname: jest.fn(() => currentPath)
}));

const trackMock = jest.fn();

jest.mock('@/components/analytics/AnalyticsContext', () => ({
  __esModule: true,
  useAnalytics: () => ({
    track: trackMock,
    flushQueue: jest.fn()
  })
}));

function TourHarness({
  autoStart = false,
  route
}: {
  autoStart?: boolean;
  route?: string | string[];
}) {
  const { start, completed } = usePageTour({
    id: 'kb-tour',
    title: 'Knowledge Base tour',
    steps: [
      { id: 'welcome', title: 'Bem-vindo', description: 'Introdução' },
      { id: 'finish', title: 'Concluir', description: 'Finalizar' }
    ],
    autoStart,
    route,
    metadata: { version: '1' }
  });
  const { isOpen, close } = useGuidedTour();

  return (
    <div>
      <span data-testid="is-open">{isOpen ? 'open' : 'closed'}</span>
      <span data-testid="is-completed">{completed ? 'yes' : 'no'}</span>
      <button type="button" data-testid="manual-start" onClick={() => start()}>
        Start
      </button>
      <button type="button" data-testid="close-without-complete" onClick={() => close()}>
        Close
      </button>
      <button
        type="button"
        data-testid="complete-tour"
        onClick={() => close({ markCompleted: true })}
      >
        Complete
      </button>
    </div>
  );
}

describe('GuidedTourProvider integration', () => {
  beforeEach(() => {
    currentPath = '/';
    trackMock.mockClear();
    window.localStorage.clear();
  });

  it('persists completed tours across reloads without re-opening the popup', async () => {
    currentPath = '/knowledge-base';
    const user = userEvent.setup();

    const { unmount } = render(
      <GuidedTourProvider>
        <TourHarness autoStart route="/knowledge-base" />
      </GuidedTourProvider>
    );

    await waitFor(() => expect(screen.getByTestId('is-open')).toHaveTextContent('open'));

    await act(async () => {
      await user.click(screen.getByTestId('complete-tour'));
    });

    await waitFor(() => expect(screen.getByTestId('is-open')).toHaveTextContent('closed'));
    expect(screen.getByTestId('is-completed')).toHaveTextContent('yes');

    const stored = window.localStorage.getItem('bmad:guided-tour:completed');
    expect(stored).toContain('kb-tour');

    unmount();

    const userReload = userEvent.setup();
    render(
      <GuidedTourProvider>
        <TourHarness autoStart route="/knowledge-base" />
      </GuidedTourProvider>
    );

    await waitFor(() => expect(screen.getByTestId('is-completed')).toHaveTextContent('yes'));
    expect(screen.getByTestId('is-open')).toHaveTextContent('closed');

    await act(async () => {
      await userReload.click(screen.getByTestId('manual-start'));
    });
    await waitFor(() => expect(screen.getByTestId('is-open')).toHaveTextContent('open'));
  });

  it('keeps auto-start tours closed after completion when navigating to other routes', async () => {
    currentPath = '/analytics';
    const user = userEvent.setup();

    const { rerender } = render(
      <GuidedTourProvider>
        <TourHarness autoStart route="/analytics*" />
      </GuidedTourProvider>
    );

    await waitFor(() => expect(screen.getByTestId('is-open')).toHaveTextContent('open'));
    await act(async () => {
      await user.click(screen.getByTestId('complete-tour'));
    });
    await waitFor(() => expect(screen.getByTestId('is-open')).toHaveTextContent('closed'));

    currentPath = '/analytics/overview';
    rerender(
      <GuidedTourProvider>
        <TourHarness autoStart route="/analytics*" />
      </GuidedTourProvider>
    );

    await waitFor(() => expect(screen.getByTestId('is-completed')).toHaveTextContent('yes'));
    expect(screen.getByTestId('is-open')).toHaveTextContent('closed');
  });

  it('does not reopen auto-start tours when revisiting the same route without completion', async () => {
    currentPath = '/support';
    const user = userEvent.setup();

    const { rerender } = render(
      <GuidedTourProvider>
        <TourHarness autoStart route="/support" />
      </GuidedTourProvider>
    );

    await waitFor(() => expect(screen.getByTestId('is-open')).toHaveTextContent('open'));
    await act(async () => {
      await user.click(screen.getByTestId('close-without-complete'));
    });
    await waitFor(() => expect(screen.getByTestId('is-open')).toHaveTextContent('closed'));

    currentPath = '/governanca';
    rerender(
      <GuidedTourProvider>
        <TourHarness autoStart route="/support" />
      </GuidedTourProvider>
    );

    expect(screen.getByTestId('is-open')).toHaveTextContent('closed');

    currentPath = '/support';
    rerender(
      <GuidedTourProvider>
        <TourHarness autoStart route="/support" />
      </GuidedTourProvider>
    );

    await waitFor(() => expect(screen.getByTestId('is-open')).toHaveTextContent('closed'));
    expect(screen.getByTestId('is-completed')).toHaveTextContent('no');
  });
});
