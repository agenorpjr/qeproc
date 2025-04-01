import { ReactNode } from 'react';

import { Badge, MantineColor } from '@mantine/core';
import { DataTable } from 'mantine-datatable';

import { ErrorAlert } from '@/components';

type Status = 'Urgente' | 'Orçamento' | 'Normal' | string;

const StatusBadge = ({ status }: { status: Status }) => {
  let color: MantineColor = '';

  switch (status) {
    case 'Normal':
      color = 'blue';
      break;
    case 'Urgente':
      color = 'red';
      break;
    case 'Orçamento':
      color = 'green';
      break;
    default:
      color = 'gray';
  }

  return (
    <Badge color={color} variant="filled" radius="sm">
      {status}
    </Badge>
  );
};

const AprovBadge = ({ status }: { status: Status }) => {
  let color: MantineColor = '';

  switch (status) {
    case 'Cancelado':
      color = 'orange';
      break;
    case 'Reprovado':
      color = 'red';
      break;
    case 'Aprovado':
      color = 'green';
      break;
    default:
      color = 'gray';
  }

  return (
    <Badge color={color} variant="filled" radius="sm">
      {status}
    </Badge>
  );
};

type SolicitItem = {
  id: string;
  nome_solicitacao: string;
  data_solicitacao: string;
  state: string;
  comprador: string;
  aprovacao: string
};

type SolicitProps = {
  data?: SolicitItem[];
  error: ReactNode;
  loading: boolean;
};
const SolicitacoesTabela = ({ data, error, loading }: SolicitProps) => {
  return error ? (
    <ErrorAlert title="Error loading projects" message={error.toString()} />
  ) : (
    <DataTable
      verticalSpacing="sm"
      highlightOnHover
      columns={[
        { accessor: 'Nome_da_solicitacao',
          render: ({ nome_solicitacao }) => {return nome_solicitacao}
         },
        { accessor: 'Data_Solicitacao',
          render: ({ data_solicitacao }) => {return data_solicitacao}
         },
        {
          accessor: 'Status',
          render: ({ state }) => <StatusBadge status={state} />,
        },
        { accessor: 'comprador' },
        {
          accessor: 'aprovacao',
          render: ({ aprovacao }) => <AprovBadge status={aprovacao} />,
        },
      ]}
      records={data}
      fetching={loading}
    />
  );
};

export default SolicitacoesTabela;
