"use server"

import { query } from "@/common/lib/query"
import {
  signIn,
  signOut,
} from "@/features/auth/lib/auth-config"
import { authValidation } from "@/validation/auth-validation"

export const register = async (
  prevState: unknown,
  formData: FormData
) => {
  const credentials = authValidation.parse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  await query.SignUp({
    input: credentials,
  })

  await signIn("credentials", credentials)
}

export const login = async (
  prevState: unknown,
  formData: FormData
) => {
  const credentials = authValidation.parse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  await signIn("credentials", credentials)
}

export const logout = async () => {
  await signOut()
}

export const signWithGoogle = async () => {
  await signIn("google")
}
