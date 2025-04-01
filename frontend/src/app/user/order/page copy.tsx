'use client'
import {
    Card,
    Text,
    Grid,
    Button,
    Divider,
    ActionIcon,
    Group,
    Flex,
    Stack,
    Box
} from "@mantine/core"
import { DatePickerInput } from "@mantine/dates";
import 'dayjs/locale/pt-br';

import ComboCompany from "@/components/ComboCompany/ComboCompany";
import ComboDelivery from "@/components/ComboDelivery/ComboDelivery";
import ComboCostCenter from "@/components/ComboCostCenter/CostCenter";
import ComboProject from "@/components/ComboProject/ComboProject";
import AddProduct from "@/components/AddProduct/page";

import classes from './order.module.css'
import { useSession } from "next-auth/react";

import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { addDraftNumber, getDraftNumber, updateDraft, getDraftId, getDraftsProducts, getDraftById, createOrder, getOrderNumber, getApproverByUserId, updateOrderProductsList, getOrderById, getProjectId, addProject, getProjectById, deleteDraftProduct } from "@/lib/orders/getOrderData";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { DataTable } from "mantine-datatable";
import EditProduct from "@/components/EditProduct/page";
import actionSaveOrder from "@/lib/actionSaveOrder";

export default function NewOrder() {

    const { data: session } = useSession()

    if (!session) {
        redirect("/")
    }

    if (session?.user?.role === "admin") {
        redirect("/admin")
    }
    const router = useRouter()
    const [companyName, setCompanyName] = useState('')
    const [companyId, setCompanyId] = useState(0)
    const [deliveryDate, setDeliveryDate] = useState<Date | null>(null)
    const [deliveryAddress, setDeliveryAddess] = useState('')
    const [costCenter, setCostCenter] = useState('')
    const [costCenterId, setCostCenterId] = useState(0)
    const [projectName, setProjectName] = useState('')
    const [projectId, setProjectId] = useState(0)

    const [enablefields, setEnablefields] = useState(true)
    const [enableSave, setEnableSave] = useState(true)
    const [draftNumber, setDraftNumber] = useState("")
    const [draftId, setDraftId] = useState(0)

    const [dataTable, setdataTable] = useState([])

    const resetFields = () => {
        setCompanyName("")
        setCompanyId(0)
        setDeliveryDate(null)
        setDeliveryAddess("")
        setCostCenter('')
        setCostCenterId(0)
        setProjectName('')
        setProjectId(0)
        setEnablefields(true)
        setDraftNumber("")
        setDraftId(0)
        setdataTable([])
    }

    useEffect(() => {
        if (draftNumber === '') {
            return
        }
        const getData = async () => {
            try {
                const dn = await getDraftId(draftNumber)
                const dt = await getDraftsProducts(dn)
                setdataTable(dt)

            } catch (err) { }
        }
        getData()
    }, []);


    const UpdataDP = async (draftid: number) => {
        setDraftId(draftid)
        const dt = await getDraftsProducts(draftid)
        setdataTable(dt)
    }

    const ComboCompanyData = (ComboCompanyData: any) => {
        setCompanyName(ComboCompanyData.company)
        setCompanyId(ComboCompanyData.company_id)
        saveTempDraft({ company_id: ComboCompanyData.company_id })
    }

    const ComboDeliveryData = (ComboDeliveryData: any) => {
        setDeliveryAddess(ComboDeliveryData)
        saveTempDraft({ delivery_address: ComboDeliveryData })
    }

    const ComboCostCenterData = (ComboCostCenterData: any) => {
        if (ComboCostCenterData.cost_center_id === 0) {
            setCostCenterId(0)
        } else {
            setCostCenterId(ComboCostCenterData.cost_center_id)
        }
        saveTempDraft({ cost_center_id: ComboCostCenterData.cost_center_id })
    }

    const ComboProjectData = async (ComboProjectData: any) => {
        setProjectName(ComboProjectData)
    }

    const neworderEnable = async () => {
        const latestQuery = await getDraftNumber()
        const ln = parseInt(latestQuery.replace(/([^\d])+/gim, ''));
        const latestQuerynumber = `${latestQuery.replace(/[0-9]/g, '')}${(ln + 1)}`
        setDraftNumber(latestQuerynumber)
        const adn = await addDraftNumber(latestQuerynumber, session.user?.id)
        if (draftId === 0) {
            const dn = await getDraftId(draftNumber)
            setDraftId(dn)
        }
        setEnablefields(false)
    }

    const deleteProd = async (proddata: any) => {
        const dp = await deleteDraftProduct(proddata.draft_product_list_id)
    }

    const saveTempDraft = async (tempData: any) => {
        const updateValues = await updateDraft(tempData, draftNumber)
    }

    const saveDraft = async () => {
        if (companyName === '' || deliveryDate === null || deliveryAddress === '') {
            notifications.show({
                title: "Solicitações",
                message: "Preencha todos os campos para continuar",
                position: 'top-center',
                color: 'red',
            })

            throw new Error
        } else if (companyName === 'HOLLYWOOD' && projectName === '') {
            notifications.show({
                title: "Solicitações",
                message: "Preencha todos os campos para continuar",
                position: 'top-center',
                color: 'red',
            })
            throw new Error
        } else if (companyName !== 'HOLLYWOOD' && costCenterId === 0) {
            notifications.show({
                title: "Solicitações",
                message: "Preencha todos os campos para continuar",
                position: 'top-center',
                color: 'red',
            })
            throw new Error
        }

        if (companyName === 'HOLLYWOOD' && projectName !== '') {
            const getProj = await getProjectId(projectName)
                .then(async (res) => {
                    if (!res) {
                        const addproj = await addProject(projectName)
                        const gproj = await getProjectId(projectName)
                        const values = {
                            company_id: companyId,
                            delivery_address: deliveryAddress,
                            cost_center_id: 0,
                            delivery_at: deliveryDate,
                            project_id: gproj
                        }
                        const updateValues = await updateDraft(values, draftNumber)
                        setProjectId(gproj)
                    } else {
                        const values = {
                            company_id: companyId,
                            delivery_address: deliveryAddress,
                            cost_center_id: 0,
                            delivery_at: deliveryDate,
                            project_id: res
                        }
                        const updateValues = await updateDraft(values, draftNumber)
                        setProjectId(res)
                    }
                })
        } else {
            const values = {
                company_id: companyId,
                delivery_address: deliveryAddress,
                cost_center_id: costCenterId,
                delivery_at: deliveryDate,
                project_id: 0
            }

            const updateValues = await updateDraft(values, draftNumber)
        }
        setEnableSave(false)
    }


    const saveOrder = async () => {
        if (companyName === "" || deliveryDate === null || deliveryAddress === '') {
            notifications.show({
                title: "Solicitações",
                message: "Preencha todos os campos para continuar",
                position: 'top-center',
                color: 'red',
            })
            throw new Error
        } else if (companyName === 'HOLLYWOOD' && projectId === 0) {
            notifications.show({
                title: "Solicitações",
                message: "Preencha todos os campos para continuar esse",
                position: 'top-center',
                color: 'red',
            })
            throw new Error
        } else if (companyName !== 'HOLLYWOOD' && costCenter === 0) {
            notifications.show({
                title: "Solicitações",
                message: "Preencha todos os campos para continuar",
                position: 'top-center',
                color: 'red',
            })
            throw new Error
        }

        const saveorderdata = {
            userId: session?.user?.id,
            draftId: draftId,
            company_id: companyId,
            delivery_address: deliveryAddress,
            delivery_at: deliveryDate,
            cost_center_id: costCenterId,
            project_id: projectId
        }

        const so = await actionSaveOrder(saveorderdata)
    }

    if (enablefields) {
        return (
            <Stack w="100%" h="80vh" justify="center">
                <Flex justify="center" align="center">
                    <Card shadow="sm" padding="lg" radius="md" withBorder miw='50%'>
                        <Group justify="space-between" mt="md" mb="xs">
                            <Text fw={500}>Nova Solicitação</Text>
                        </Group>
                        <Text size="sm" c="dimmed">
                            Clique para gerar uma nova solicitação
                        </Text>
                        <Button onClick={neworderEnable} mt={30}>Nova Solicitação</Button>
                    </Card>
                </Flex>
            </Stack>
        )
    } else {
        return (
            <Stack w="100%" justify="center">
                <Card shadow="sm" padding='sm'>
                    <Card.Section p="sm" className={classes.card}>
                        <Group justify="space-between">
                            <Text fw={900} size="md" className={classes.title} >
                                Solicitação de Materiais
                            </Text>
                            <Text fw={900} size="md" className={classes.title}>
                                {new Date(Date.now()).toLocaleString('pt-BR').split(',')[0]}
                            </Text>
                        </Group>
                    </Card.Section>
                    <Group justify="space-between">
                        <Text fw={900} size="lg" mt="md" mb={10} variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} >
                            Dados da Solicitação - Nº {draftNumber}
                        </Text>
                    </Group>
                    <Divider mb={15} />
                    <Grid>
                        <Grid.Col span={{ base: 12, xs: 4 }}>
                            <ComboCompany ComboCompanyData={ComboCompanyData} companyName={""} />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, xs: 4 }}>
                            {companyName === "HOLLYWOOD" ? <ComboProject ComboProjectData={ComboProjectData} projectName={""} /> : <ComboCostCenter ComboCostCenterData={ComboCostCenterData} costCenterName={""} companyId={companyId}/>}
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, xs: 4 }}>
                            <DatePickerInput
                                required
                                label="Data de Entrega"
                                placeholder="Selecione uma Data"
                                value={deliveryDate}
                                onChange={setDeliveryDate}
                                onMouseEnter={() => saveTempDraft({ delivery_at: deliveryDate })}
                                locale="pt-br"
                                firstDayOfWeek={1}
                                valueFormat="DD/MM/YYYY"
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, xs: 6 }}>
                            <ComboDelivery ComboDeliveryData={ComboDeliveryData} deliveryAddress={""} />
                        </Grid.Col>
                    </Grid>
                    <Divider mb={5} mt={30} />
                    <Grid>
                        <Grid.Col span={{ base: 12, xs: 6 }}>
                            <Flex gap='md' mt={10}>
                                <Text className={classes.subtitle} mt={1}>
                                    Lista de Materiais
                                </Text>

                                <AddProduct draftNumber={draftNumber} upDataDP={UpdataDP} />
                            </Flex>
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <DataTable
                                columns={[
                                    {
                                        accessor: 'products.description',
                                        title: 'Produtos',
                                        width: "30%"
                                    },
                                    {
                                        accessor: 'measures.measure',
                                        title: "Medida",
                                        width: "10%"
                                    },
                                    {
                                        accessor: 'quantity',
                                        title: 'Quantidade',
                                        width: "10%"
                                    },
                                    {
                                        accessor: 'obs',
                                        title: "Observações",
                                        width: "20%"
                                    },
                                    {
                                        accessor: 'reference',
                                        title: "Referência",
                                        width: "20%"
                                    },
                                    {
                                        accessor: 'actions',
                                        title: <Box mr={6}>Ações</Box>,
                                        textAlign: 'right',
                                        width: '0%',
                                        render: (record) => (
                                            <Group gap={4} justify="right" wrap="nowrap">
                                                <EditProduct dataprod={record} upDataDP={UpdataDP} />
                                                <ActionIcon
                                                    size="sm"
                                                    variant="subtle"
                                                    color="red"
                                                    onClick={(e: React.MouseEvent) => {
                                                        e.stopPropagation();
                                                        deleteProd(record)
                                                        UpdataDP(record.draft_id)
                                                    }}
                                                >
                                                    <IconTrash size={16} />
                                                </ActionIcon>
                                            </Group>
                                        )
                                    }
                                ]}
                                records={dataTable}
                                striped
                                highlightOnHover
                                withTableBorder
                                idAccessor="products.product_id"
                            />
                        </Grid.Col>
                    </Grid>
                    <Grid type="container" mt={50}>
                        <Grid.Col span={{ base: 12, xs: 12 }}>
                            <Button variant="filled" color="teal.7"
                                onClick={async () => {
                                    const sd = await saveDraft()
                                        .then(() => {
                                            notifications.show({
                                                title: "Solicitação",
                                                message: "Solicitação salva com Sucesso!!!",
                                                position: 'top-center',
                                                color: 'indigo',
                                            })
                                        })
                                }
                                }
                            >Salvar Solicitação</Button>
                            {enableSave ? <></> :
                                <Button ml={20} variant="filled" color="indigo"
                                    onClick={async () => {
                                        const so = await saveOrder()
                                            .then(() => {
                                                notifications.show({
                                                    title: "Requisição",
                                                    message: "Requisição efetuada com Sucesso!!!",
                                                    position: 'top-center',
                                                    color: 'indigo',
                                                })
                                            })
                                            .then(() => {
                                                resetFields()
                                                router.push("/user/orders")
                                            })

                                    }
                                    }
                                >Enviar Requisição</Button>}
                        </Grid.Col>
                    </Grid>
                </Card>
            </Stack >
        )
    }
}