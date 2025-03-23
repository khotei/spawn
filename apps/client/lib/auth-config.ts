import { omit } from "lodash"
import NextAuth, { type NextAuthResult } from "next-auth"
import { Adapter } from "next-auth/adapters"
import Credentials from "next-auth/providers/credentials"

import { query } from "@/lib/query"
import { signInFormSchema } from "@/validation/auth-validation"

export const GraphQLAdapter: Adapter = {
  async createSession(session) {
    const { createSession } = await query.CreateSession({
      input: session,
    })

    return createSession
  },

  async createUser(user) {
    const { createUser } = await query.CreateUser({
      input: user,
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

  async getUserByAccount({ providerAccountId }) {
    // @todo: is "providerAccountId" is unique for each user
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

  async linkAccount(account) {
    await query.LinkAccount({
      input: account,
    })
  },

  async unlinkAccount({ provider, providerAccountId }) {
    // @todo: is "providerAccountId",  is unique for each user. do we need "type"?
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

export const {
  auth,
  handlers,
  signIn,
  signOut,
}: NextAuthResult = NextAuth({
  adapter: GraphQLAdapter,
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const { signIn: _signIn } = await query.SignIn({
          input: signInFormSchema.parse(credentials),
        })

        return _signIn
      },

      credentials: {
        email: {},
        password: {},
      },
    }),
  ],
  session: {
    maxAge: 30 * 24 * 60 * 60,
    strategy: "jwt" as const,
  },
})
