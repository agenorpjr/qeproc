'use server'
import db from "./db/db"
import { zodschema } from "./zodschema"
import bcrypt from 'bcryptjs'

const signUp = async (formData: FormData) => {

    const password = formData.get('password')
    const password2 = formData.get('password2')
    if (password !== password2) {
        return {
            success: false,
            message: "Senhas não conferem."
        }
    }
    try {
        const name = formData.get('name')
        const email = formData.get('email')
        const role = formData.get('role')
        const approver_id = formData.get('approver_id')
        const validatedData = zodschema.parse({ email, password })
        const hashPwd = await bcrypt.hash(validatedData.password, 10)
        
        console.log('resultado de name', name)
        console.log('resultado de role', role)
        await db.user.create({
            data: {
                name: name,
                email: validatedData.email.toLowerCase(),
                password: hashPwd,
                role: role,
                approver_id: approver_id
            }
        })
        return {
            success: true,
            message: "Usuário Criado com Sucesso",
        };
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
}

export { signUp }