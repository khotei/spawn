import { omit } from "lodash"
import { Adapter } from "next-auth/adapters"

import { query } from "@/common/lib/query"

export const GraphGQLAuthAdapter: Adapter = {
  async createSession(session) {
    console.log("createSession called with:", session)
    const { createSession } = await query.CreateSession({
      input: session,
    })

    return createSession
  },

  async createUser(newUser) {
    console.log("createUser called with:", newUser)
    const { createUser } = await query.CreateUser({
      input: omit(newUser, "id"),
    })

    return createUser
  },

  async createVerificationToken(token) {
    console.log(
      "createVerificationToken called with:",
      token
    )
    const { createVerificationToken } =
      await query.CreateVerificationToken({
        input: token,
      })

    return createVerificationToken
  },

  async deleteSession(sessionToken) {
    console.log("deleteSession called with:", sessionToken)
    await query.DeleteSession({
      input: { sessionToken },
    })
  },

  async getSessionAndUser(sessionToken) {
    console.log(
      "getSessionAndUser called with:",
      sessionToken
    )
    const { session } = await query.Session({
      input: { sessionToken },
    })

    return session
      ? {
          session: omit(session, ["user"]),
          user: session.user,
        }
      : null
  },

  async getUser(id) {
    console.log("getUser called with:", id)
    const { user } = await query.User({
      input: { id },
    })

    return user
  },

  async getUserByAccount({ provider, providerAccountId }) {
    console.log("getUserByAccount called with:", {
      provider,
      providerAccountId,
    })
    // @todo: add provider
    const { userByAccount } = await query.UserByAccountId({
      input: {
        provider,
        providerAccountId,
      },
    })

    return userByAccount
  },

  async getUserByEmail(email) {
    console.log("getUserByEmail called with:", email)
    const { userByEmail } = await query.UserByEmail({
      input: { email },
    })

    return userByEmail
  },

  async linkAccount({
    access_token,
    expires_at,
    id_token,
    refresh_token,
    token_type,
    ...account
  }) {
    console.log("linkAccount called with:", {
      access_token,
      expires_at,
      id_token,
      refresh_token,
      token_type,
      ...account,
    })
    await query.LinkAccount({
      input: {
        ...account,
        accessToken: access_token,
        expiresAt: expires_at
          ? new Date(expires_at)
          : undefined,
        idToken: id_token,
        refreshToken: refresh_token,
        tokenType: token_type,
      },
    })
  },

  async unlinkAccount({ provider, providerAccountId }) {
    console.log("unlinkAccount called with:", {
      provider,
      providerAccountId,
    })
    await query.UnlinkAccount({
      input: { provider, providerAccountId },
    })
  },

  async updateSession({ sessionToken, ...data }) {
    console.log("updateSession called with:", {
      sessionToken,
      ...data,
    })
    const { updateSession } = await query.UpdateSession({
      input: {
        sessionToken,
        ...data,
      },
    })

    return updateSession
  },

  async updateUser(user) {
    console.log("updateUser called with:", user)
    const { updateUser } = await query.UpdateUser({
      input: user,
    })

    return updateUser
  },

  async useVerificationToken({ identifier, token }) {
    console.log("useVerificationToken called with:", {
      identifier,
      token,
    })
    const { verifyToken } = await query.VerifyToken({
      input: { identifier, token },
    })

    return verifyToken
  },
}
