import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

const Page = async () => {

  const session = await auth();
  if (!session) redirect("/sign-in")
  
  if (session && session?.user?.role === "admin") {
    redirect("/dashboard")
  } else {
    redirect("/user")
  }
  
};

export default Page;
