'use client';

import {
  Button,
  Container,
  Grid,
  Group,
  Paper,
  PaperProps,
  Stack,
  Text,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';

import {
  PageHeader,
} from '@/components';
import { useFetchData } from '@/hooks';
import { PATH_TASKS } from '@/routes';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
  style: { height: '100%' },
};

function Page() {
  const router = useRouter()
  const {data: session } = useSession();

  if (session?.user?.role === "admin") {
    router.push("/admin/dashboard")
    location.reload()
  }

  return (
    <>
      <>
        <title>Sistema de Compras</title>
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="User dashboard" withActions={true} />
          
          <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>
            {/* <Grid.Col span={8}>
              <RevenueChart {...PAPER_PROPS} />
            </Grid.Col> */}
            {/* <Grid.Col span={4}>
              <SalesChart {...PAPER_PROPS} />
            </Grid.Col> */}
            {/* <Grid.Col span={4}>
              <MobileDesktopChart {...PAPER_PROPS} />
            </Grid.Col> */}
            <Grid.Col span={12}>
              <Paper {...PAPER_PROPS}>
                <Group justify="space-between" mb="md">
                  <Text size="lg" fw={600}>
                    Solicitações
                  </Text>
                  <Button
                    variant="subtle"
                    component={Link}
                    href={PATH_TASKS.root}
                    rightSection={<IconChevronRight size={18} />}
                  >
                    View all
                  </Button>
                </Group>
                {/* <ProjectsTable
                  data={projectsData.slice(0, 6)}
                  error={projectsError}
                  loading={projectsLoading}
                /> */}

              </Paper>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}

export default Page;
