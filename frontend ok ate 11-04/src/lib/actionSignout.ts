'use server'
import { redirect } from "next/navigation"
import { signOut } from "./auth"

export default async function SignOutF() {
    try {
        await signOut()
    } catch (erro) {

    } finally {
        redirect("/")
    }

}