import Link from "next/link"
import type { ReactNode } from "react"

import { LogoutButton } from "@/app/(root)/logout-button"
import { auth } from "@/features/auth/lib/auth-config"

const RootLayout = async ({
  children,
}: {
  children: ReactNode
}) => {
  const session = await auth()

  return (
    <>
      <header>
        <nav>
          {session ? (
            <LogoutButton />
          ) : (
            <>
              <Link href="/sign-in">Sign In</Link>
              <Link href="/sign-up">Sign Up</Link>
            </>
          )}
        </nav>
      </header>
      <main>{children}</main>
    </>
  )
}

export default RootLayout
