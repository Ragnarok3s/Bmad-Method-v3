import React, { createContext, useContext, useState } from 'react';

export type Density = 'compact' | 'comfortable';

interface DensityContextType {
  density: Density;
  setDensity: (density: Density) => void;
  toggleDensity: () => void;
}

const DensityContext = createContext<DensityContextType | undefined>(undefined);

export function DensityProvider({ children }: { children: React.ReactNode }) {
  const [density, setDensity] = useState<Density>('comfortable');

  const toggleDensity = () => {
    setDensity(prev => prev === 'compact' ? 'comfortable' : 'compact');
  };

  return (
    <DensityContext.Provider value={{ density, setDensity, toggleDensity }}>
      {children}
    </DensityContext.Provider>
  );
}

export function useDensity() {
  const context = useContext(DensityContext);
  if (context === undefined) {
    throw new Error('useDensity must be used within a DensityProvider');
  }
  return context;
}
