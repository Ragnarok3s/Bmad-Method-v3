'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

import { tourMatchesPath, useGuidedTour } from './TourContext';

export function TourLauncher() {
  const { tours, startTour, hasCompleted } = useGuidedTour();
  const pathname = usePathname() ?? '';
  const [selectedTourId, setSelectedTourId] = useState<string>('');

  const availableTours = useMemo(() => {
    return tours.filter((tour) => tourMatchesPath(tour.route, pathname));
  }, [pathname, tours]);

  useEffect(() => {
    if (availableTours.length === 0) {
      setSelectedTourId('');
      return;
    }
    if (!selectedTourId || !availableTours.some((tour) => tour.id === selectedTourId)) {
      setSelectedTourId(availableTours[0]?.id ?? '');
    }
  }, [availableTours, selectedTourId]);

  if (availableTours.length === 0 || !selectedTourId) {
    return null;
  }

  const activeTour = availableTours.find((tour) => tour.id === selectedTourId) ?? availableTours[0];
  const completed = hasCompleted(activeTour.id);
  const statusMessage = completed ? 'Concluído — pode rever os passos principais' : 'Duração média ~3 minutos';

  return (
    <div className="tour-launcher" data-completed={completed ? 'true' : 'false'}>
      <div className="tour-launcher__body">
        <div>
          <p className="tour-launcher__eyebrow">Tour guiado</p>
          <strong>{activeTour.title}</strong>
          {activeTour.description && (
            <span className="tour-launcher__description">{activeTour.description}</span>
          )}
          <span className="tour-launcher__status" data-completed={completed ? 'true' : 'false'}>
            {statusMessage}
          </span>
        </div>
        <div className="tour-launcher__actions">
          {availableTours.length > 1 && (
            <label className="tour-launcher__select">
              <span className="sr-only">Selecionar tour disponível</span>
              <select
                value={activeTour.id}
                onChange={(event) => setSelectedTourId(event.target.value)}
                aria-label="Selecionar tour da página"
              >
                {availableTours.map((tour) => (
                  <option key={tour.id} value={tour.id}>
                    {tour.title}
                    {hasCompleted(tour.id) ? ' · concluído' : ''}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button
            type="button"
            onClick={() => startTour(activeTour.id)}
            className="tour-launcher__cta"
            aria-label={completed ? 'Rever tour guiado da página' : 'Iniciar tour guiado da página'}
          >
            {completed ? 'Rever tour' : 'Iniciar tour'}
          </button>
        </div>
      </div>
      <style jsx>{`
        .tour-launcher {
          position: relative;
          display: grid;
          padding: var(--space-4) var(--space-5);
          border-radius: var(--radius-md);
          background: #fff;
          border: 1px solid rgba(11, 60, 93, 0.1);
          box-shadow: var(--shadow-card);
          max-width: 420px;
        }
        .tour-launcher::before {
          content: '';
          position: absolute;
          top: var(--space-4);
          bottom: var(--space-4);
          left: 0;
          width: 4px;
          border-radius: var(--radius-xs);
          background: var(--color-deep-blue);
        }
        .tour-launcher[data-completed='true']::before {
          background: var(--color-soft-aqua);
        }
        .tour-launcher__body {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
          flex-wrap: wrap;
        }
        .tour-launcher__eyebrow {
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.75rem;
          color: var(--color-neutral-2);
        }
        strong {
          display: block;
          font-size: 1.1rem;
          color: var(--color-deep-blue);
        }
        .tour-launcher__description {
          display: block;
          font-size: 0.9rem;
          color: var(--color-neutral-2);
          margin-top: 0.35rem;
        }
        .tour-launcher__status {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          margin-top: var(--space-2);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 600;
          color: var(--color-neutral-2);
        }
        .tour-launcher__status[data-completed='true'] {
          color: var(--color-soft-aqua);
        }
        .tour-launcher__actions {
          display: inline-flex;
          align-items: center;
          gap: var(--space-3);
        }
        .tour-launcher__select {
          display: inline-flex;
          align-items: center;
          background: rgba(11, 60, 93, 0.05);
          border-radius: var(--radius-sm);
          padding: 0 var(--space-2);
        }
        .tour-launcher__select select {
          border: none;
          background: transparent;
          color: var(--color-deep-blue);
          font-weight: 600;
          padding: var(--space-1) var(--space-2);
          cursor: pointer;
        }
        .tour-launcher__select select:focus-visible {
          outline: 2px solid var(--color-soft-aqua);
          outline-offset: 2px;
        }
        .tour-launcher__cta {
          border-radius: var(--radius-sm);
          border: 1px solid transparent;
          background: var(--color-deep-blue);
          color: #fff;
          padding: var(--space-2) var(--space-4);
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease, border 0.2s ease, color 0.2s ease;
        }
        .tour-launcher__cta:hover,
        .tour-launcher__cta:focus-visible {
          background: #07273b;
        }
        .tour-launcher[data-completed='true'] .tour-launcher__cta {
          background: rgba(46, 196, 182, 0.15);
          color: var(--color-deep-blue);
          border-color: rgba(46, 196, 182, 0.35);
        }
        .tour-launcher[data-completed='true'] .tour-launcher__cta:hover,
        .tour-launcher[data-completed='true'] .tour-launcher__cta:focus-visible {
          background: rgba(46, 196, 182, 0.25);
        }
        @media (max-width: 768px) {
          .tour-launcher {
            max-width: 100%;
          }
          .tour-launcher__body {
            flex-direction: column;
            align-items: stretch;
          }
          .tour-launcher__actions {
            justify-content: space-between;
          }
          .tour-launcher__cta {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
