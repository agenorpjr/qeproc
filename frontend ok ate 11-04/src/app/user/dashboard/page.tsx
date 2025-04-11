'use client';

import {
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Group,
  Paper,
  PaperProps,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import { PageHeader } from '@/components';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import classes from './dashboard.module.css';
import { useEffect, useState } from 'react';
import { getOrders } from '@/lib/orders/getOrderData';
import { IconBasketCog, IconShoppingBagCheck, IconShoppingBagExclamation } from '@tabler/icons-react';


function Page() {
  const router = useRouter()
  const { data: session } = useSession();

  if (session?.user?.role === "admin") {
    router.push("/admin/dashboard")
    location.reload()
  }

  const [ordersApprove, setOrdersApprove] = useState()
  const [ordersRequest, setOrdersRequest] = useState()
  const [drafts, setDrafts] = useState()

  useEffect(() => {
      const getOrderApp = async () => {
        const goa = await getOrders(session?.user?.id)
      }
  }, [])


  return (
    <>
      <>
        <title>Sistema de Compras</title>
      </>
      <Container fluid>

        <PageHeader title="Dashboard" withActions={true} />
        <Grid mt={20}>
          <Grid.Col span={{ base: 12, xs: 4 }}>
            <Card
              shadow="md"
              padding="xl"
              withBorder
              radius='md'
              className={classes.card}>
              <Stack
                h='30vh'
                align='stretch'
                justify="center"
                gap="md">
                  <Flex justify='center'>
                  <IconShoppingBagExclamation size={100} ></IconShoppingBagExclamation>
                  </Flex>
                
                <Title order={4}>REQUISIÇÕES PARA APROVAR</Title>
                <Text>10 Requisições</Text>
              </Stack>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, xs: 4 }}>
            <Card
              shadow="sm"
              padding="xl"
              className={classes.card}>
              <Stack
                h='30vh'
                align='stretch'
                justify="center"
                gap="md">
                  <Flex justify='center'>
                  <IconShoppingBagCheck size={100} ></IconShoppingBagCheck>
                  </Flex>
                <Title order={3}>REQUISIÇÕES EFETUADAS</Title>
                <Text>100 Requisições</Text>
              </Stack>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, xs: 4 }}>
            <Card
              shadow="lg"
              padding="xl"
              className={classes.card}>
              <Stack
                h='30vh'
                align='stretch'
                justify="center"
                gap="md">
                  <Flex justify='center'>
                  <IconBasketCog size={100} ></IconBasketCog>
                  </Flex>
                <Title order={3}>SOLICITAÇÕES</Title>
                <Text>50 Solicitações</Text>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>









      </Container>
    </>
  );
}

export default Page;
