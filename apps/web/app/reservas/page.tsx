'use client';

import { Card } from '@/components/ui/Card';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';

const reservas = [
  {
    hospede: 'Carla Monteiro',
    status: 'Check-in hoje',
    statusVariant: 'success' as const,
    detalhes: ['Quarto Deluxe · 3 noites', 'Pré-autorização confirmada', 'Pedido especial: amenities vegan']
  },
  {
    hospede: 'Grupo Horizon',
    status: 'Overbooking potencial',
    statusVariant: 'critical' as const,
    detalhes: ['15 quartos', 'Alerta gerado via integração PMS', 'Acionar playbook de contingência']
  },
  {
    hospede: 'Diego Figueira',
    status: 'Checkout amanhã',
    statusVariant: 'warning' as const,
    detalhes: ['Solicitou late checkout', 'Sincronizar com housekeeping', 'Rever cobranças extras']
  }
];

export default function ReservasPage() {
  return (
    <div>
      <SectionHeader subtitle="Fluxo completo de reservas com filtros dinâmicos e alertas contextuais">
        Gestão de Reservas
      </SectionHeader>
      <Card title="Filtros rápidos" description="Identifique lacunas operacionais em segundos." accent="info">
        <ResponsiveGrid columns={3}>
          <div>
            <strong>Status</strong>
            <p>Check-ins de hoje, atrasados, cancelamentos.</p>
          </div>
          <div>
            <strong>Segmento</strong>
            <p>Corporate, lazer, eventos, agências.</p>
          </div>
          <div>
            <strong>Integridade</strong>
            <p>Pagamentos pendentes, contratos, SLA parceiros.</p>
          </div>
        </ResponsiveGrid>
      </Card>
      <SectionHeader subtitle="Detalhes chave com foco na experiência e mitigação de riscos">
        Reservas em destaque
      </SectionHeader>
      <ResponsiveGrid columns={3}>
        {reservas.map((reserva) => (
          <Card key={reserva.hospede} title={reserva.hospede} description="" accent="info">
            <StatusBadge variant={reserva.statusVariant}>{reserva.status}</StatusBadge>
            <ul>
              {reserva.detalhes.map((detalhe) => (
                <li key={detalhe}>{detalhe}</li>
              ))}
            </ul>
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
      `}</style>
    </div>
  );
}
