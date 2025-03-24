import { camelCase, mapKeys, omit } from "lodash"
import { Adapter } from "next-auth/adapters"

import { query } from "@/common/lib/query"

export const GraphGQLAuthAdapter: Adapter = {
  async createSession(session) {
    const { createSession } = await query.CreateSession({
      input: session,
    })

    return createSession
  },

  async createUser(newUser) {
    const { createUser } = await query.CreateUser({
      input: omit(newUser, "id"),
    })

    return createUser
  },

  async createVerificationToken(token) {
    const { createVerificationToken } =
      await query.CreateVerificationToken({
        input: token,
      })

    return createVerificationToken
  },

  async deleteSession(sessionToken) {
    await query.DeleteSession({
      input: { sessionToken },
    })
  },

  async getSessionAndUser(sessionToken) {
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
    const { user } = await query.User({
      input: { id },
    })

    return user
  },

  async getUserByAccount({ provider, providerAccountId }) {
    // @todo: add provider
    const { userByProviderUserId } =
      await query.UserByProviderUserId({
        input: {
          providerUserId: providerAccountId,
        },
      })

    return userByProviderUserId
  },

  async getUserByEmail(email) {
    const { userByEmail } = await query.UserByEmail({
      input: { email },
    })

    return userByEmail
  },

  async linkAccount({ expires_at, ...account }) {
    console.log(
      mapKeys(account, (__, key) => camelCase(key))
    )
    await query.LinkAccount({
      input: mapKeys(
        {
          ...account,
          expires_at: expires_at
            ? new Date(expires_at)
            : undefined,
        },
        (__, key) => camelCase(key)
      ),
    })
  },

  async unlinkAccount({ provider, providerAccountId }) {
    await query.UnlinkAccount({
      input: { provider, providerAccountId },
    })
  },

  async updateSession({ sessionToken, ...data }) {
    const { updateSession } = await query.UpdateSession({
      input: {
        sessionToken,
        ...data,
      },
    })

    return updateSession
  },

  async updateUser(user) {
    const { updateUser } = await query.UpdateUser({
      input: user,
    })

    return updateUser
  },

  async useVerificationToken({ identifier, token }) {
    const { verifyToken } = await query.VerifyToken({
      input: { identifier, token },
    })

    return verifyToken
  },
}
