'use client';

import { DataTable, type DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useEffect, useState } from 'react';
import { deleteOrderById, deleteOrderProduct, getOrders, getOrdersProducts } from '@/lib/orders/getOrderData';
import { redirect, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';
import { ActionIcon, Box, Button, Card, Pill, Divider, Flex, Grid, Group, Modal, Stack, Title, Text, Tooltip } from '@mantine/core';

import classes from './orders.module.css'
import { IconAdjustments, IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import Loading from '@/app/loading';
import actionCopyOrder from '@/lib/actionCopyOrder';

export type Order = {
  draft_id: number;
  draft_number: number,
  company_id: number,
  delivery_address: string,
  cost_center_id: number,
  cost_center: string,
  project: string,
  projetct_id: number,
  created_at: string,
  delivery_at: string,
  draft_status: string,
  companies: string,
  draft_products_list: []
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  if (session?.user?.role === "admin") {
    redirect("/admin")
  }

  const router = useRouter()

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Order>>({
    columnAccessor: 'order_number',
    direction: 'asc',
  });
  const [modalDelete, { open, close }] = useDisclosure(false)
  const [ordersData, setOrdersData] = useState<Order>([])
  const [records, setRecords] = useState(sortBy(ordersData, 'order_id'));
  const [draftTemp, setOrderTemp] = useState(null)

  useEffect(() => {
    const orders = async () => {
      try {
        const res = await getOrders(session?.user?.id)
        setOrdersData(res)
        const data = sortBy(res, sortStatus.columnAccessor) as Order[];
        setRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
      } catch (err) { }
    }
    orders()
  }, [sortStatus, session?.user?.id]);

  const orderCopy = async (data: any) => {
    const oc = await actionCopyOrder(data)
      .then(() => {
        router.push('/user/drafts')
      })
  }

  // const deleteOrder = async (datadeletedraft: any) => {
  //   const gdp = await getOrdersProducts(datadeletedraft)
  //   const delprods = gdp.map(async (res) => {
  //     await deleteOrderProduct(res.draft_product_list_id)
  //   })

  //   const res = await deleteOrderById(datadeletedraft)
  //   updateOrders()
  // }

  // const updateOrders = async () => {
  //   try {
  //     const res = await getOrders(session?.user?.id)
  //     setOrdersData(res)
  //     const data = sortBy(res, sortStatus.columnAccessor) as Order[];
  //     setRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
  //   } catch (err) { }
  // }

  if (status === 'loading') return <Loading />

  return (
    <>
      <Flex justify='flex-start'><Title order={2} mb={20} className={classes.title} >Requisições</Title></Flex>
      <DataTable
        withTableBorder
        withColumnBorders
        records={records}
        columns={[
          { accessor: 'order_number', width: '5%', sortable: true, title: "Requisição nº" },
          { accessor: 'companies.company', width: '25%', title: "Empresa", sortable: true },
          { accessor: 'delivery_address', width: '35%', title: "Endereço de Entrega" },
          { accessor: 'cost_centers.cost_center', width: '15%', title: "Centro de Custo", sortable: true },
          { accessor: 'projects.project', width: '15%', title: "Projeto", sortable: true },
          {
            accessor: 'delivery_at',
            textAlign: 'right',
            sortable: true,
            width: '15%',
            title: "Data de Entrega",
            render: ({ delivery_at }) => dayjs(delivery_at).format("DD/MM/YYYY")
          },
          {
            accessor: 'created_at',
            textAlign: 'right',
            sortable: true,
            width: '15%',
            title: "Data da Requisição",
            render: ({ created_at }) => dayjs(created_at).format("DD/MM/YYYY")
          },
          {
            accessor: 'actions',
            title: <Box mr={6}>Status</Box>,
            textAlign: 'right',
            width: '0%',
            render: (record) => (
              <Group gap={4} justify="right" wrap="nowrap">
                <Pill
                  size="sm"
                  onClick={
                    (e: React.MouseEvent) => {
                      e.stopPropagation()
                    }}
                  className={classes.pill}>{record.status}
                </Pill>
              </Group>

            )
          }
        ]}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        idAccessor="order_id"
        rowExpansion={{
          content: ({ record }) => (
            <Stack className={classes.details} p="xs" gap={6}>
              <Card shadow="sm" padding="md" radius="md" withBorder className={classes.card}>
                <Grid>
                  <Grid.Col span={6}><Text fw={700} size='xs'>PRODUTO</Text></Grid.Col>
                  <Grid.Col span={2}><Text fw={700} size='xs'>QUANTIDADE</Text></Grid.Col>
                  <Grid.Col span={2}><Text fw={700} size='xs'>MEDIDA</Text></Grid.Col>
                  <Grid.Col span={2}>
                    <Flex justify="flex-end">
                      <Tooltip label="Gerar Cópia da Requisição">
                        <ActionIcon variant="filled" aria-label="Settings" onClick={() => orderCopy(record)}>
                          <IconAdjustments style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>
                      </Tooltip>
                    </Flex>
                  </Grid.Col>
                </Grid>
                <Divider my="md" />
                {record.order_products_list.map((item) => {
                  return (
                    <>
                      <Grid>
                        <Grid.Col span={6}><Text size='xs'>{item.products.description}</Text></Grid.Col>
                        <Grid.Col span={2}><Text size='xs'>{item.quantity}</Text></Grid.Col>
                        <Grid.Col span={2}><Text size='xs'>{item.measures.measure}</Text></Grid.Col>
                      </Grid>
                      <Divider my="sm" />
                    </>
                  )
                })}
              </Card>
            </Stack>
          )
        }}

      />
      <Modal
        opened={modalDelete}
        onClose={close}
        title="ATENÇÃO! Tem certeza que deseja excluir?"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Grid mt={20}>
          <Grid.Col span={4} >
            <Button size="md" fullWidth onClick={() => {
              setOrderTemp(null)
              close()
            }}>Cancelar</Button>

          </Grid.Col>
          <Grid.Col span={4}>
            <Button fullWidth size="md" color='red'
              onClick={() => {
                deleteOrder(draftTemp)
                setOrderTemp(null)
                close()
              }}
            >Excluir</Button>

          </Grid.Col>


        </Grid>
      </Modal>
    </>
  );
}