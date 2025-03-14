'use client'
import {
    Card,
    Text,
    Grid,
    Button,
    Divider,
    ScrollArea,
    Table,
    ActionIcon,
    Group,
    Box,
    Flex
} from "@mantine/core"
import { DatePickerInput } from "@mantine/dates";
import 'dayjs/locale/pt-br';
import cx from 'clsx';
import { DataTable, type DataTableSortStatus } from 'mantine-datatable';

import ComboCompany from "@/components/ComboCompany/ComboCompany";
import ComboDelivery from "@/components/ComboDelivery/ComboDelivery";
import ComboCostCenter from "@/components/ComboCostCenter/CostCenter";
import ComboProject from "@/components/ComboProject/ComboProject";
import AddProduct from "@/components/AddProduct/page";

import classes from './page.module.css'
import { useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { updateDraft, getDraftsProducts, getDraftById, createOrder, getOrderNumber, getApproverByUserId, updateOrderProductsList, getOrderById, getProjectId, addProject, deleteDraftProduct } from "@/lib/orders/getOrderData";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import Loading from "@/app/loading";
import EditProduct from "@/components/EditProduct/page";

export default function EditDraftPage() {

    const { data: session } = useSession()
    if (session?.user?.role === "admin") {
        redirect("/admin")
    }
    const searchParams = useSearchParams()
    const dId = searchParams.get('dId')

    const [showData, setShowData] = useState(false)
    const [companyName, setCompanyName] = useState(null)
    const [companyId, setCompanyId] = useState('')
    const [deliveryDate, setDeliveryDate] = useState<Date | null>(null)
    const [draftDate, setDraftDate] = useState<Date | null>(null)
    const [deliveryAddress, setDeliveryAddess] = useState('')
    const [costCenter, setCostCenter] = useState('')
    const [costCenterId, setCostCenterId] = useState(0)
    const [projectName, setProjectName] = useState('')
    const [projectId, setProjectId] = useState(0)

    const [draftNumber, setDraftNumber] = useState("")
    const [draftId, setDraftId] = useState(0)

    const [scrolled, setScrolled] = useState(false);
    const [dataTable, setdataTable] = useState([])

    const resetFields = () => {
        setCompanyName("")
        setDeliveryDate(null)
        setDraftNumber("")
        setDraftId(0)
        setScrolled(false)
        setdataTable([])
    }

    const getData = async () => {

        const res = await getDraftById(parseInt(dId))
        setCompanyName(res.companies?.company)
        setCompanyId(res.company_id)
        setDeliveryAddess(res.delivery_address)
        setDeliveryDate(res.delivery_at)
        setDraftDate(res.created_at)
        setDraftNumber(res.draft_number)
        setDraftId(res.draft_id)
        setdataTable(res.draft_products_list)
        if (res.companies?.company === 'HOLLYWOOD') {
            setCostCenterId(0)
            setProjectName(res.project ? res.project : '')
            setProjectId(res.project_id)
        } else {
            setCostCenter(res.cost_center ? res.cost_center : '')
            setCostCenterId(res.cost_center_id)
            setProjectName("")
        }
        setShowData(true)


    }

    useEffect(() => {
        getData()

    }, [])

    useEffect(() => {
    }, [companyName, companyId, costCenter, costCenterId, projectName, projectId, deliveryAddress])

    const UpdataDP = async (draftid: number) => {
        setDraftId(draftid)
        const dt = await getDraftsProducts(draftid)
        setdataTable(dt)
    }

    const deleteProd = async (proddata: any) => {
        const dp = await deleteDraftProduct(proddata.draft_product_list_id)
    }

    const ComboCompanyData = (ComboCompanyData: any) => {
        setCompanyName(ComboCompanyData.company)
        setCompanyId(ComboCompanyData.company_id)
    }

    const ComboDeliveryData = (ComboDeliveryData: any) => {
        setDeliveryAddess(ComboDeliveryData)
        //saveTempDraft({ delivery_address: ComboDeliveryData })
    }

    const ComboCostCenterData = (ComboCostCenterData: any) => {
        if (ComboCostCenterData.const_center === "") {
            setCostCenterId(0)
            setCostCenter('')
        } else {
            setCostCenter(ComboCostCenterData.cost_center)
            setCostCenterId(ComboCostCenterData.cost_center_id)
        }
    }

    const ComboProjectData = (ComboProjectData: any) => {
        setProjectName(ComboProjectData)
    }



    const saveDraft = async () => {
        if (companyName === 'HOLLYWOOD' && projectName === '') {
            notifications.show({
                title: "Solicitações",
                message: "Preencha todos os campos para continuar",
                position: 'top-center',
                color: 'red',
            })
            throw new Error
        }

        if(companyName !== 'HOLLYWOOD' && costCenter === '') {
            notifications.show({
                title: "Solicitações",
                message: "Preencha todos os campos para continuar",
                position: 'top-center',
                color: 'red',
            })
            throw new Error
        }

        if (deliveryAddress === '') {
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
                    } else {
                        const values = {
                            company_id: companyId,
                            delivery_address: deliveryAddress,
                            cost_center_id: 0,
                            delivery_at: deliveryDate,
                            project_id: res
                        }
                        const updateValues = await updateDraft(values, draftNumber)
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
                message: "Preencha todos os campos para continuar",
                position: 'top-center',
                color: 'red',
            })
            throw new Error
        } else if (companyName !== 'HOLLYWOOD' && costCenter === '') {
            notifications.show({
                title: "Solicitações",
                message: "Preencha todos os campos para continuar",
                position: 'top-center',
                color: 'red',
            })
            throw new Error
        }

        const approverid = await getApproverByUserId(session?.user?.id)
        const draftvalues = await getDraftById(draftId)
        const draftproducts = await getDraftsProducts(draftId)
        const gon = await getOrderNumber()
        const on = gon + 1
        //const on = gon
        const codata = {
            order_number: on,
            user_id: session?.user?.id,
            company_id: draftvalues?.company_id,
            delivery_address: draftvalues?.delivery_address,
            project_id: draftvalues?.project_id,
            cost_center_id: draftvalues?.cost_center_id,
            approver_id: approverid,
            delivery_at: draftvalues?.delivery_at
        }
        const co = await createOrder(codata)
        const orderid = await getOrderById(on)

        const updatedata = draftproducts.map(async (item) => {
            const prods = {
                order_id: orderid,
                product_id: item.product_id,
                measure_id: item.measure_id,
                quantity: item.quantity,
                reference: item.reference,
                obs: item.obs
            }
            const up = await updateOrderProductsList(prods)
        })

    }

    if (!showData) return <Loading />

    return (
        <Card shadow="sm" padding='xl' className={classes.wcard}>
            <Card.Section p="sm" className={classes.card}>
                <Grid>
                    <Grid.Col span={12}>
                        <Text fw={900} size="md" className={classes.title} >
                            Requisição de Materiais
                        </Text>
                    </Grid.Col>

                </Grid>

            </Card.Section>
            <Grid type="container">
                <Grid.Col span={10}>
                    <Text fw={900} size="lg" mt="md" mb={10} variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }}>
                        Dados da Solicitação - Nº {draftNumber}
                    </Text>
                </Grid.Col>
                <Grid.Col span={2}>
                    <Text fw={500} size="sm" mt="md" mb={10} >
                        Data: {new Date(draftDate).toLocaleDateString()}
                    </Text>
                </Grid.Col>
            </Grid>

            <Grid type="container" mt={10}>
                <Grid.Col span={4}>
                    <ComboCompany ComboCompanyData={ComboCompanyData} companyName={companyName} />
                </Grid.Col>
                <Grid.Col span={4}>
                    {companyName === "HOLLYWOOD" ? <ComboProject ComboProjectData={ComboProjectData} projectName={projectName} /> : <ComboCostCenter ComboCostCenterData={ComboCostCenterData} costCenterName={costCenter} />}
                </Grid.Col>
                <Grid.Col span={4}>
                    <DatePickerInput
                        required
                        label="Data de Entrega"
                        placeholder="Selecione uma Data"
                        value={deliveryDate}
                        onChange={setDeliveryDate}
                        locale="pt-br"
                        firstDayOfWeek={1}
                        valueFormat="DD/MM/YYYY"
                    />
                </Grid.Col>
                <Grid.Col span={8}>
                    <ComboDelivery ComboDeliveryData={ComboDeliveryData} deliveryAddress={deliveryAddress} />
                </Grid.Col>
            </Grid>
            <Divider mt={30} />
            <Grid>
                <Grid.Col span={2}>
                    <Text fw={900} size="lg" mt="md" variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }}>
                        Lista de Materiais
                    </Text>
                </Grid.Col>
                <Grid.Col span={4}>
                    <AddProduct draftNumber={draftNumber} upDataDP={UpdataDP} />
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

            <Card.Section className="classes.footer" m={20}>
                <Group justify="space-between">
                    <Group gap={0}>
                    <Button variant="filled" color="teal.7"
                    onClick={async () => {
                        await saveDraft()
                        notifications.show({
                            title: "Salvar Rascunho",
                            message: "Rascunho salvo com Sucesso!!!",
                            position: 'top-center',
                            color: 'indigo',
                        })
                        //resetFields()
                    }
                    }
                >Salvar Rascunho</Button>
                <Button ml={20} variant="filled" color="indigo"
                    onClick={async () => {
                        await saveOrder()
                        notifications.show({
                            title: "Solicitações",
                            message: "Solicitação efetuada com Sucesso!!!",
                            position: 'top-center',
                            color: 'indigo',
                        })
                        resetFields()
                    }
                    }
                >Enviar Requisição</Button>
                    </Group>
                </Group>
            </Card.Section>

                


        </Card>

    )
}