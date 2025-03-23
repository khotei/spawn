import { redirect } from "next/navigation"
import type { ReactNode } from "react"

import { auth } from "@/lib/auth-config"

const AuthLayout = async ({
  children,
}: {
  children: ReactNode
}) => {
  const session = await auth()

  if (session) {
    redirect("/")
  }

  return <>{children}</>
}

export default AuthLayout
