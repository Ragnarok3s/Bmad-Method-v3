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

  return (
    <div className="tour-launcher" data-completed={completed ? 'true' : 'false'}>
      <div className="tour-launcher__body">
        <div>
          <p className="tour-launcher__eyebrow">Tour guiado</p>
          <strong>{activeTour.title}</strong>
          {activeTour.description && <span className="tour-launcher__description">{activeTour.description}</span>}
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
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          padding: var(--space-3) var(--space-4);
          background: linear-gradient(135deg, rgba(11, 60, 93, 0.95), rgba(46, 196, 182, 0.85));
          color: #fff;
          box-shadow: var(--shadow-card);
          min-width: 280px;
        }
        .tour-launcher__body {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }
        .tour-launcher__eyebrow {
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.75rem;
        }
        strong {
          display: block;
          font-size: 1.05rem;
        }
        .tour-launcher__description {
          display: block;
          font-size: 0.875rem;
          opacity: 0.85;
          margin-top: 0.25rem;
        }
        .tour-launcher__actions {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }
        .tour-launcher__select select {
          border-radius: var(--radius-sm);
          border: none;
          background: rgba(255, 255, 255, 0.18);
          color: #fff;
          padding: var(--space-1) var(--space-3);
          font-weight: 600;
          cursor: pointer;
        }
        .tour-launcher__select select:focus-visible {
          outline: 2px solid rgba(255, 255, 255, 0.9);
          outline-offset: 2px;
        }
        .tour-launcher__cta {
          border-radius: var(--radius-sm);
          border: none;
          background: #fff;
          color: var(--color-deep-blue);
          padding: var(--space-2) var(--space-4);
          font-weight: 600;
          cursor: pointer;
        }
        .tour-launcher[data-completed='true'] .tour-launcher__cta {
          background: rgba(255, 255, 255, 0.16);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.6);
        }
        @media (max-width: 768px) {
          .tour-launcher {
            width: 100%;
          }
          .tour-launcher__body {
            flex-direction: column;
            align-items: stretch;
          }
          .tour-launcher__actions {
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}
