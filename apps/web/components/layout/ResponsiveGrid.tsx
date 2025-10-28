'use client';

import { PropsWithChildren } from 'react';

interface ResponsiveGridProps extends PropsWithChildren {
  columns?: number;
}

export function ResponsiveGrid({ children, columns = 3 }: ResponsiveGridProps) {
  return (
    <div className="responsive-grid">
      {children}
      <style jsx>{`
        .responsive-grid {
          display: grid;
          gap: var(--space-4);
          grid-template-columns: repeat(${columns}, minmax(0, 1fr));
        }
        @media (max-width: 1200px) {
          .responsive-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 768px) {
          .responsive-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
