'use client'
import {
    Card,
    Text,
    Grid,
    Button,
    Divider,
    ScrollArea,
    Table,
    ActionIcon
} from "@mantine/core"
import { DatePickerInput } from "@mantine/dates";
import 'dayjs/locale/pt-br';
import cx from 'clsx';

import ComboCompany from "@/components/ComboCompany/ComboCompany";
import ComboDelivery from "@/components/ComboDelivery/ComboDelivery";
import ComboCostCenter from "@/components/ComboCostCenter/CostCenter";
import ComboProject from "@/components/ComboProject/ComboProject";
import AddProduct from "@/components/AddProduct/page";

import classes from './page.module.css'
import { useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { updateDraft, getDraftsProducts, getDraftById, createOrder, getOrderNumber, getApproverByUserId, updateOrderProductsList, getOrderById, getProjectId, addProject } from "@/lib/orders/getOrderData";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import Loading from "@/app/loading";

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



    const rows = dataTable.map((row) => (
        <Table.Tr key={row.draft_product_list_id}>
            <Table.Td>{row.products.description}</Table.Td>
            <Table.Td>{row.measures.measure}</Table.Td>
            <Table.Td>{row.quantity}</Table.Td>
            <Table.Td>{row.obs}</Table.Td>
            <Table.Td>{row.reference}</Table.Td>
            <Table.Td>
                <ActionIcon variant="light" color="teal" aria-label="Settings" onClick={() => alert('Teste')}>
                <IconEdit style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
                <ActionIcon variant="light" color="red" aria-label="Settings">
                <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
            </Table.Td>
        </Table.Tr>
    ));

    const UpdataDP = async (draftid: number) => {
        setDraftId(draftid)
        const dt = await getDraftsProducts(draftid)
        setdataTable(dt)
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

    const saveTempDraft = async (tempData: any) => {
        const updateValues = await updateDraft(tempData, draftNumber)
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
            console.log('vamos ver os dados que estao vindo', values)
            // const updateValues = await updateDraft(values, draftNumber)
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

    if (!showData ) return <Loading />

    return (

        <Card shadow="sm" padding='xl'>
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
                        Dados da Requisição - Nº {draftNumber}
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
                    <ScrollArea h={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                        {/* <Button onClick={DraftTableData} >Enviar dados</Button> */}
                        <Table miw={700} striped highlightOnHover withColumnBorders>
                            <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                                <Table.Tr>
                                    <Table.Th>Produto</Table.Th>
                                    <Table.Th>Medida</Table.Th>
                                    <Table.Th>Quantidade</Table.Th>
                                    <Table.Th>Observações</Table.Th>
                                    <Table.Th>Referencia</Table.Th>
                                    <Table.Th>Ações</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{rows}</Table.Tbody>
                        </Table>
                    </ScrollArea>
                </Grid.Col>
            </Grid>
            <Grid type="container" mt={10}>
                <Grid.Col span={6}>
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
                    >Enviar Solicitação</Button>
                </Grid.Col>
            </Grid>
        </Card>

    )
}