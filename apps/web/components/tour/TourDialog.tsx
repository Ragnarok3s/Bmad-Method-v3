'use client';

import { useEffect, useId } from 'react';
import { useGuidedTour } from './TourContext';

export function TourDialog() {
  const { isOpen, close, next, previous, steps, currentIndex } = useGuidedTour();
  const titleId = useId();
  const descriptionId = useId();
  const activeStep = steps[currentIndex];

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isOpen) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [close, isOpen]);

  if (!isOpen || !activeStep) {
    return null;
  }

  return (
    <div className="tour-overlay" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId}>
      <div className="tour-content">
        <p className="tour-step-counter">Passo {currentIndex + 1} de {steps.length}</p>
        <h2 id={titleId}>{activeStep.title}</h2>
        <p id={descriptionId}>{activeStep.description}</p>
        <div className="tour-actions">
          <button type="button" onClick={previous} disabled={currentIndex === 0}>
            Anterior
          </button>
          {currentIndex < steps.length - 1 ? (
            <button type="button" onClick={next}>
              Próximo
            </button>
          ) : (
            <button type="button" onClick={close}>
              Concluir tour
            </button>
          )}
        </div>
        <button className="tour-close" type="button" onClick={close} aria-label="Fechar tour guiado">
          ×
        </button>
      </div>
      <style jsx>{`
        .tour-overlay {
          position: fixed;
          inset: 0;
          background: rgba(11, 60, 93, 0.6);
          display: grid;
          place-items: center;
          padding: var(--space-6);
          z-index: 2000;
        }
        .tour-content {
          position: relative;
          background: #fff;
          border-radius: var(--radius-md);
          max-width: 520px;
          width: 100%;
          padding: var(--space-5);
          box-shadow: var(--shadow-card);
          display: grid;
          gap: var(--space-4);
        }
        .tour-step-counter {
          margin: 0;
          font-size: 0.875rem;
          color: var(--color-neutral-2);
        }
        .tour-actions {
          display: flex;
          gap: var(--space-3);
          justify-content: flex-end;
        }
        .tour-actions button {
          border-radius: var(--radius-sm);
          padding: var(--space-2) var(--space-4);
          border: none;
          cursor: pointer;
          font-weight: 600;
        }
        .tour-actions button:first-of-type {
          background: transparent;
          color: var(--color-deep-blue);
          border: 1px solid var(--color-deep-blue);
        }
        .tour-actions button:last-of-type {
          background: var(--color-deep-blue);
          color: #fff;
        }
        .tour-actions button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .tour-close {
          position: absolute;
          top: var(--space-2);
          right: var(--space-2);
          background: transparent;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--color-neutral-2);
        }
        @media (max-width: 768px) {
          .tour-overlay {
            padding: var(--space-4);
          }
          .tour-content {
            padding: var(--space-4);
          }
        }
      `}</style>
    </div>
  );
}
