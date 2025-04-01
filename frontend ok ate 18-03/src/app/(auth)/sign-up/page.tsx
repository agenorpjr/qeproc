'use client'
import {
    NativeSelect,
    Button,
    Group,
    Paper,
    Center,
    PasswordInput,
    Stack,
    Title,
    TextInput,
    Notification,
    useCombobox,
    Combobox,
    InputBase,
    Input
} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { signUp } from "@/lib/actionSignup";
import { redirect } from 'next/navigation';
import classes from './signup.module.css';
import { useSession } from 'next-auth/react';
import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { getApproverByName, getApprovers } from '@/lib/orders/getOrderData';
import Loading from '@/app/loading';

export default function SignUpPage() {

    const { data: session, status } = useSession()

    if (status === "unauthenticated") {
        redirect("/sign-in")
    }

    if (session?.user?.role === "user") {
        redirect("/user")
    }

    const [approvers, setApprovers] = useState([])
    const [selectedApprover, setSelectedApprover] = useState<string | null>(null)
    const [approverId, setApproverId] = useState('')
    const [nameUser, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [role, setRole] = useState("user")


    useEffect(() => {
        const getapprovers = async () => {
            const res = await getApprovers()
            setApprovers(res)
        }
        getapprovers()
    }, [])

    useEffect(() => {

    }, [approvers, approverId])


    const optionsApproverCombo = approvers.filter(({ name }) => name.toLowerCase())
        .map(({ name, id }) => (
            <Combobox.Option value={name} key={id}>
                {name}
            </Combobox.Option>
        ))

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });


    const createUser = async () => {
        if (nameUser === "" || nameUser.length < 5) {
            notifications.show({
                title: "Registro de Usuário",
                message: "Nome Inválido",
                position: 'top-center',
                color: 'red',
            })
            throw new Error
        }

        if (email === '') {
            notifications.show({
                title: "Registro de Usuário",
                message: "Email Inválido",
                position: 'top-center',
                color: 'red',
            })
            throw new Error
        }

        if (password === '' || password.length < 6) {
            notifications.show({
                title: "Registro de Usuário",
                message: "Senha Inválida",
                position: 'top-center',
                color: 'red',
            })
            throw new Error
        }

        if (password !== password2) {
            notifications.show({
                title: "Registro de Usuário",
                message: "Senhas Não Conferem",
                position: 'top-center',
                color: 'red',
            })
            throw new Error
        }
        try {
            const aId = await getApproverByName(nameUser)
            const dataSignUp = {
                name: nameUser,
                email: email,
                password: password,
                password2: password2,
                role: role,
                approver_id: "2"
            }
            console.log('dados que vai pro signup', dataSignUp)
            const sup = await signUp(dataSignUp)
            console.log('dados do signup', sup)
        } catch (err) {
            notifications.show({
                title: "Registro de Usuário",
                message: "Preencha todos os campos para continuar",
                position: 'top-center',
                color: 'red',
            })
            throw new Error
        } finally {
            notifications.show({
                title: "Registro de Usuário",
                message: "Usuário Criado com Sucesso",
                position: 'top-center',
                color: 'indigo',
            })

        }

    }
    const icon = <IconInfoCircle />;

    if (!approvers) return <Loading />

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Center style={{ width: '100vw', height: '100vh' }} bg="var(--mantine-color-gray-light)">
                <Paper withBorder p="lg" radius="md" shadow="md">
                    <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
                        Sistema de Compras Quanta - Registro de Usuário
                    </Title>

                    <div>
                        <Stack>
                            <TextInput
                                required
                                label="Nome"
                                placeholder="Nome do Usuário"
                                radius="md"
                                onChange={(event) => setName(event.currentTarget.value)}
                            />
                            <TextInput
                                required
                                label="Email"
                                placeholder="email@quanta.works"
                                name="email"
                                radius="md"
                                onChange={(event) => setEmail(event.currentTarget.value)}
                            />

                            <PasswordInput
                                required
                                label="Digite uma Senha de no mínimo 6 digitos"
                                placeholder="Sua Senha"
                                name="password"
                                radius="md"
                                onChange={(event) => setPassword(event.currentTarget.value)}
                            />

                            <PasswordInput
                                required
                                label="Repita a Senha"
                                placeholder="Repita a Senha"
                                radius="md"
                                onChange={(event) => setPassword2(event.currentTarget.value)}
                            />

                            <Combobox
                                store={combobox}
                                onOptionSubmit={(val) => {
                                    setSelectedApprover(val);
                                    combobox.closeDropdown();
                                }}
                            >
                                <Combobox.Target>
                                    <InputBase
                                        required
                                        component="button"
                                        type="button"
                                        label="Aprovador"
                                        pointer
                                        rightSection={<Combobox.Chevron />}
                                        rightSectionPointerEvents="none"
                                        onClick={() => combobox.toggleDropdown()}
                                    >
                                        {selectedApprover || <Input.Placeholder>Selecione</Input.Placeholder>}
                                    </InputBase>
                                </Combobox.Target>

                                <Combobox.Dropdown>
                                    <Combobox.Options>{optionsApproverCombo}</Combobox.Options>
                                </Combobox.Dropdown>
                            </Combobox>
                            <NativeSelect
                                label="Regra de Usuário"
                                required
                                value={role}
                                data={[
                                    { label: 'Usuário', value: "user" },
                                    { label: 'Administrador', value: "admin" },
                                    { label: 'Aprovador', value: "approver" }
                                ]} 
                                onChange={(e) => setRole(e.currentTarget.value)}
                                />

                        </Stack>

                        <Group justify="space-between" mt="xl">

                            <Button onClick={createUser} radius="xl">
                                Registrar
                            </Button>
                        </Group>
                    </div>
                </Paper>
            </Center>
        </div>

    );
}