import { Metadata } from 'next';

import { MarketplaceHub } from './MarketplaceHub';

export const metadata: Metadata = {
  title: 'Marketplace de parceiros',
  description: 'Contratos públicos, sandbox instantâneo e auditoria de integrações BMAD.'
};

export default function MarketplacePage() {
  return <MarketplaceHub />;
}
