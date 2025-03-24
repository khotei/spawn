"use client"
import { useActionState } from "react"

import {
  login,
  signWithGoogle,
} from "@/features/auth/actions/auth.actions"
import { signIn } from "@/features/auth/lib/auth-config"

export const SignInForm = () => {
  const [data, action] = useActionState(login, null)

  return (
    <>
      <form action={action}>
        <label>
          Email
          <input
            name="email"
            type="email"
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
          />
        </label>
        <button>Sign In</button>
      </form>
      <button onClick={signWithGoogle}>
        Sign in with Google
      </button>
    </>
  )
}
