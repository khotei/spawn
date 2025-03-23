"use client"
import { useActionState } from "react"

import { register } from "@/actions/auth.actions"

export const SignUpForm = () => {
  const [data, action] = useActionState(register, null)

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
