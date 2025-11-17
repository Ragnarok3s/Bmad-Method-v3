import { Metadata } from 'next';

import { ExtensionsHub } from './ExtensionsHub';

export const metadata: Metadata = {
  title: 'Catálogo de extensões BMAD',
  description:
    'Sandbox seguro, governança compartilhada e rollout progressivo para extensões co-criadas com parceiros.'
};

export default function ExtensionsPage() {
  return <ExtensionsHub />;
}
