"use client"

import { logout } from "@/features/auth/actions/auth.actions"

export const LogoutButton = () => {
  return <button onClick={() => logout()}>Logout</button>
}
