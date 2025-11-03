'use client';

import { useEffect, useId, useRef } from 'react';
import { useGuidedTour } from './TourContext';

export function TourDialog() {
  const { isOpen, close, next, previous, steps, currentIndex, activeStep } = useGuidedTour();
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const primaryButtonRef = useRef<HTMLButtonElement | null>(null);
  const liveRegionRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isOpen) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        next();
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        previous();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [close, isOpen, next, previous]);

  useEffect(() => {
    if (isOpen && primaryButtonRef.current) {
      primaryButtonRef.current.focus();
    }
  }, [isOpen, currentIndex]);

  useEffect(() => {
    if (!isOpen || !activeStep?.target) {
      return;
    }
    const element = document.querySelector<HTMLElement>(activeStep.target);
    if (!element) {
      return;
    }
    const previousAriaDescribedBy = element.getAttribute('aria-describedby');
    const nextDescription = previousAriaDescribedBy
      ? `${previousAriaDescribedBy} ${descriptionId}`.trim()
      : descriptionId;
    element.setAttribute('data-tour-highlighted', 'true');
    element.setAttribute('aria-describedby', nextDescription);
    return () => {
      element.removeAttribute('data-tour-highlighted');
      if (previousAriaDescribedBy) {
        element.setAttribute('aria-describedby', previousAriaDescribedBy);
      } else {
        element.removeAttribute('aria-describedby');
      }
    };
  }, [activeStep, descriptionId, isOpen]);

  useEffect(() => {
    if (!isOpen || !dialogRef.current) {
      return;
    }
    dialogRef.current.scrollIntoView({ block: 'center' });
  }, [isOpen, currentIndex]);

  if (!isOpen || !activeStep) {
    return null;
  }

  const isLastStep = currentIndex >= steps.length - 1;
  const handleFinish = () => close({ markCompleted: true });

  return (
    <div
      ref={dialogRef}
      className="tour-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div className="tour-content">
        <p className="tour-step-counter">
          Passo {currentIndex + 1} de {steps.length}
        </p>
        <h2 id={titleId}>{activeStep.title}</h2>
        <p id={descriptionId} ref={liveRegionRef} aria-live="polite">
          {activeStep.description}
        </p>
        <div className="tour-actions" role="group" aria-label="Navegação do tour guiado">
          <button type="button" onClick={previous} disabled={currentIndex === 0}>
            Anterior
          </button>
          {!isLastStep ? (
            <button type="button" onClick={next} ref={primaryButtonRef}>
              Próximo
            </button>
          ) : (
            <button type="button" onClick={handleFinish} ref={primaryButtonRef}>
              Concluir tour
            </button>
          )}
        </div>
        <button className="tour-close" type="button" onClick={() => close()} aria-label="Fechar tour guiado">
          ×
        </button>
      </div>
      <style jsx>{`
        .tour-overlay {
          position: fixed;
          inset: 0;
          background: rgba(37, 99, 235, 0.6);
          display: grid;
          place-items: center;
          padding: var(--space-6);
          z-index: 2000;
          pointer-events: none;
        }
        .tour-content {
          position: relative;
          background: #fff;
          border-radius: var(--radius-md);
          max-width: 540px;
          width: 100%;
          padding: var(--space-5);
          box-shadow: var(--shadow-card);
          display: grid;
          gap: var(--space-4);
          pointer-events: auto;
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
        :global([data-tour-highlighted='true']) {
          outline: 3px solid var(--color-soft-aqua);
          outline-offset: 4px;
          border-radius: var(--radius-sm);
          transition: outline 0.2s ease;
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
