import { render } from '@testing-library/react';
import React from 'react';

import { usePageTour } from '../usePageTour';

const registerTour = jest.fn();
const cleanupMock = jest.fn();
const startTour = jest.fn();
const hasCompleted = jest.fn(() => false);

jest.mock('../TourContext', () => {
  const actual = jest.requireActual('../TourContext');
  return {
    ...actual,
    useGuidedTour: () => ({
      registerTour,
      startTour,
      hasCompleted
    })
  };
});

function TestHarness({ iteration }: { iteration: number }) {
  usePageTour({
    id: 'stable-tour',
    title: 'Stable tour',
    description: 'Ensures we only register once',
    steps: [
      { id: 'intro', title: 'Intro', description: 'First step' }
    ],
    route: ['/support/knowledge-base'],
    autoStart: true
  });

  return <span data-testid="render-count">{iteration}</span>;
}

describe('usePageTour', () => {
  beforeEach(() => {
    registerTour.mockClear();
    cleanupMock.mockClear();
    registerTour.mockReturnValue(cleanupMock);
    startTour.mockClear();
    hasCompleted.mockClear().mockReturnValue(false);
  });

  it('registers a tour only once for equivalent route arrays across renders', () => {
    const { rerender, unmount } = render(<TestHarness iteration={0} />);

    expect(registerTour).toHaveBeenCalledTimes(1);
    expect(cleanupMock).not.toHaveBeenCalled();

    rerender(<TestHarness iteration={1} />);

    expect(registerTour).toHaveBeenCalledTimes(1);
    expect(cleanupMock).not.toHaveBeenCalled();

    unmount();

    expect(cleanupMock).toHaveBeenCalledTimes(1);
  });
});
