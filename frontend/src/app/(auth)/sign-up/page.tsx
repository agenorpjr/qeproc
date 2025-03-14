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
    Notification
} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { signUp } from "@/lib/actionSignup";
import { redirect } from 'next/navigation';
import classes from './signup.module.css';
import { useSession } from 'next-auth/react';
import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { getApprovers } from '@/lib/orders/getOrderData';
import Loading from '@/app/loading';

export default function SignUpPage() {

    const { data: session, status } = useSession()

    if (status === "unauthenticated") {
        redirect("/sign-in")
    }

    if (session?.user?.role === "user") {
        redirect("/user")
    }

    const [approvers, setApprovers] = useState(null)

    useEffect(() => {
        const getapprovers = async () => {
            let appnames = []
            const res = await getApprovers()
            const apps = res.map((item) => {
                appnames.push({
                    name: item.name,
                    id: item.id
            })
            })
            setApprovers(appnames)
            
            
        }
        getapprovers()
    }, [])

    useEffect(() => {
        console.log('aprovadores', approvers)
    }, [approvers])

    async function action(formData: FormData) {
        try {
            const sup = await signUp(formData)
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

                    <form action={action}>
                        <Stack>
                            <TextInput
                                required
                                label="Nome"
                                placeholder="Nome do Usuário"
                                name="name"
                                radius="md"
                            />
                            <TextInput
                                required
                                label="Email"
                                placeholder="email@quanta.works"
                                name="email"
                                radius="md"
                            />

                            <PasswordInput
                                required
                                label="Digite uma Senha de no mínimo 6 digitos"
                                placeholder="Sua Senha"
                                name="password"
                                radius="md"
                            />

                            <PasswordInput
                                required
                                label="Repita a Senha"
                                placeholder="Repita a Senha"
                                name="password2"
                                radius="md"
                            />
                            <TextInput
                                
                                label="Aprovador"
                                placeholder="Aprovador"
                                name="approver_id"
                                radius="md"
                            />
                            <NativeSelect label="Regra de Usuário" required name='role'
                                data={[
                                    { label: 'Usuário', value: "user" },
                                    { label: 'Administrador', value: "admin" },
                                    { label: 'Aprovador', value: "approver" }
                                ]} />

                        </Stack>

                        <Group justify="space-between" mt="xl">

                            <Button type="submit" radius="xl">
                                Registrar
                            </Button>
                        </Group>
                    </form>
                </Paper>
            </Center>
        </div>

    );
}