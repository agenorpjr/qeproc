import { ReactNode } from 'react';

import { PaperProps, SimpleGrid, Skeleton } from '@mantine/core';

import { ErrorAlert } from '@/components';
import StatsCard from '@/components/StatsCard/StatsCard';

import classes from './StatsGrid.module.css';

type StatsGridProps = {
  data?: { title: string; value: string; diff: number; period?: string; color: string }[];
  paperProps?: PaperProps;
  error?: ReactNode;
  loading?: boolean;

};

export default function StatsGrid({
  data,
  loading,
  error,
  paperProps,
}: StatsGridProps) {
  const stats = data?.map((stat) => (
    <StatsCard key={stat.title} data={stat} {...paperProps} />
  ));

  return (
    <div className={classes.root}>
      {error ? (
        <ErrorAlert title="Erro Carregando Dados..." message={error.toString()} />
      ) : (
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 4 }}
          spacing={{ base: 10, sm: 'xl' }}
          verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
          {loading
            ? Array.from({ length: 4 }).map((o, i) => (
                <Skeleton
                  key={`stats-loading-${i}`}
                  visible={true}
                  height={200}
                />
              ))
            : stats}
        </SimpleGrid>
      )}
    </div>
  );
}
