'use client';

import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { StatusBadge } from '@/components/ui/StatusBadge';

const perfis = [
  {
    nome: 'Administrador',
    permissoes: ['Gerir agentes e playbooks', 'Configurar integrações', 'Consultar métricas avançadas'],
    estado: 'Completo',
    variant: 'success' as const
  },
  {
    nome: 'Colaborador',
    permissoes: ['Executar playbooks', 'Consultar base de conhecimento', 'Reportar incidentes'],
    estado: 'Revisar instruções',
    variant: 'warning' as const
  },
  {
    nome: 'Analista de Operações',
    permissoes: ['Dashboard Analytics', 'Ajustar SLAs', 'Gerir tickets críticos'],
    estado: 'Inclui auditoria ativa',
    variant: 'info' as const
  }
];

const politicas = [
  'Revisão mensal de permissões com base em logs de auditoria',
  'Registro automático de alterações no catálogo de agentes',
  'Suporte a MFA obrigatório e política de sessão curta'
];

export default function GovernancaPage() {
  return (
    <div>
      <SectionHeader subtitle="Papéis, permissões e auditoria alinhados ao BL-05">
        Governança & Segurança
      </SectionHeader>
      <ResponsiveGrid columns={3}>
        {perfis.map((perfil) => (
          <Card key={perfil.nome} title={perfil.nome}>
            <StatusBadge variant={perfil.variant}>{perfil.estado}</StatusBadge>
            <ul>
              {perfil.permissoes.map((permissao) => (
                <li key={permissao}>{permissao}</li>
              ))}
            </ul>
          </Card>
        ))}
      </ResponsiveGrid>
      <Card title="Políticas destacadas" description="Checklist recomendado para administradores" accent="info">
        <ul>
          {politicas.map((politica) => (
            <li key={politica}>{politica}</li>
          ))}
        </ul>
      </Card>
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
