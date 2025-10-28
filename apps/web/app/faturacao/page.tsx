'use client';

import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { StatusBadge } from '@/components/ui/StatusBadge';

const ajustes = [
  {
    referencia: 'FT-8742',
    descricao: 'Checkout corporativo · Ajuste de early check-in',
    valor: '+€120',
    status: 'Revisão financeira',
    variant: 'warning' as const
  },
  {
    referencia: 'FT-8739',
    descricao: 'Pacote SPA · Cobrança duplicada',
    valor: '-€80',
    status: 'Reembolso agendado',
    variant: 'critical' as const
  },
  {
    referencia: 'FT-8735',
    descricao: 'Evento Horizon · Faturação concluída',
    valor: '+€4 560',
    status: 'Concluído',
    variant: 'success' as const
  }
];

const checklist = [
  'Validar notas fiscais com integrações fiscais locais',
  'Executar reconciliação diária com PMS',
  'Automatizar envio de recibos digitais',
  'Acompanhar indicadores de recebíveis (D+5)'
];

export default function FaturacaoPage() {
  return (
    <div>
      <SectionHeader subtitle="Checkout, ajustes e geração de faturas alinhados às políticas do manual">
        Faturação & Financeiro
      </SectionHeader>
      <Card title="Checklist diário" description="Fluxos críticos a validar em cada turno." accent="info">
        <ul>
          {checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Card>
      <SectionHeader subtitle="Transações recentes com estados descritivos e acessíveis">
        Ajustes financeiros
      </SectionHeader>
      <ResponsiveGrid columns={3}>
        {ajustes.map((ajuste) => (
          <Card key={ajuste.referencia} title={ajuste.referencia} description={ajuste.descricao}>
            <p className="valor">{ajuste.valor}</p>
            <StatusBadge variant={ajuste.variant}>{ajuste.status}</StatusBadge>
          </Card>
        ))}
      </ResponsiveGrid>
      <style jsx>{`
        ul {
          margin: 0;
          padding-left: var(--space-5);
          display: grid;
          gap: var(--space-2);
        }
        .valor {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
