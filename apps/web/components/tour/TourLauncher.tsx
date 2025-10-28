'use client';

import { useEffect } from 'react';
import { useGuidedTour } from './TourContext';

const defaultSteps = [
  {
    id: 'dashboard',
    title: 'Dashboard de Operações',
    description: 'Monitore agentes ativos, KPIs de ocupação e alertas críticos em tempo real.'
  },
  {
    id: 'housekeeping',
    title: 'Housekeeping Offline-First',
    description: 'Sincronize tarefas mesmo sem internet e atribua incidentes instantaneamente.'
  },
  {
    id: 'analytics',
    title: 'Analytics e Adoção',
    description: 'Acompanhe métricas de adoção e exporte relatórios para o steering executivo.'
  }
];

export function TourLauncher() {
  const { open, registerSteps } = useGuidedTour();

  useEffect(() => {
    registerSteps(defaultSteps);
  }, [registerSteps]);

  return (
    <button type="button" className="tour-launcher" onClick={open}>
      Iniciar tour guiado
      <style jsx>{`
        .tour-launcher {
          border-radius: var(--radius-sm);
          border: none;
          background: linear-gradient(135deg, var(--color-deep-blue), var(--color-soft-aqua));
          color: #fff;
          padding: var(--space-2) var(--space-5);
          font-weight: 600;
          cursor: pointer;
          box-shadow: var(--shadow-card);
        }
      `}</style>
    </button>
  );
}
