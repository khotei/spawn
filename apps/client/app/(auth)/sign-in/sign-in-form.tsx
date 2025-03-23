"use client"
import { useActionState } from "react"

import { login } from "@/actions/auth.actions"

export const SignInForm = () => {
  const [data, action] = useActionState(login, null)

  return (
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
  )
}
