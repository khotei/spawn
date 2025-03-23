"use client"

import { logout } from "@/actions/auth.actions"

export const LogoutButton = () => {
  return <button onClick={() => logout()}>Logout</button>
}
