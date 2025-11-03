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

function TourRegistryInspector() {
  const { tours } = useGuidedTour();
  return <span data-testid="tour-count">{tours.length}</span>;
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
    expect(trackMock).toHaveBeenCalledWith(
      'tour.started',
      expect.objectContaining({ tourId: 'kb-tour', route: '/knowledge-base', autoStart: true })
    );

    await act(async () => {
      await user.click(screen.getByTestId('complete-tour'));
    });

    await waitFor(() => expect(screen.getByTestId('is-open')).toHaveTextContent('closed'));
    expect(screen.getByTestId('is-completed')).toHaveTextContent('yes');
    expect(trackMock).toHaveBeenCalledWith(
      'tour.completed',
      expect.objectContaining({ tourId: 'kb-tour', steps: 2, route: '/knowledge-base' })
    );
    expect(trackMock).toHaveBeenCalledWith(
      'tour.closed',
      expect.objectContaining({ tourId: 'kb-tour', markedCompleted: true })
    );

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

  it('closes an active tour when the pathname changes', async () => {
    currentPath = '/settings';
    const user = userEvent.setup();

    const { rerender } = render(
      <GuidedTourProvider>
        <TourHarness />
      </GuidedTourProvider>
    );

    await act(async () => {
      await user.click(screen.getByTestId('manual-start'));
    });

    await waitFor(() => expect(screen.getByTestId('is-open')).toHaveTextContent('open'));

    currentPath = '/settings/profile';
    rerender(
      <GuidedTourProvider>
        <TourHarness />
      </GuidedTourProvider>
    );

    await waitFor(() => expect(screen.getByTestId('is-open')).toHaveTextContent('closed'));
    await waitFor(() =>
      expect(trackMock).toHaveBeenCalledWith(
        'tour.closed',
        expect.objectContaining({ tourId: 'kb-tour', markedCompleted: false })
      )
    );

    await act(async () => {
      await user.click(screen.getByTestId('manual-start'));
    });

    await waitFor(() => expect(screen.getByTestId('is-open')).toHaveTextContent('open'));
  });

  it('registers and unregisters tours via usePageTour lifecycle', async () => {
    currentPath = '/';
    const user = userEvent.setup();

    function RegistryToggle() {
      const [visible, setVisible] = React.useState(true);
      return (
        <div>
          <TourRegistryInspector />
          {visible ? <TourHarness route="/" /> : null}
          <button type="button" data-testid="toggle-tour" onClick={() => setVisible((state) => !state)}>
            Toggle
          </button>
        </div>
      );
    }

    render(
      <GuidedTourProvider>
        <RegistryToggle />
      </GuidedTourProvider>
    );

    await waitFor(() => expect(screen.getByTestId('tour-count')).toHaveTextContent('1'));

    await act(async () => {
      await user.click(screen.getByTestId('toggle-tour'));
    });

    await waitFor(() => expect(screen.getByTestId('tour-count')).toHaveTextContent('0'));
  });
});
