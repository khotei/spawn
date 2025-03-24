import NextAuth, { type NextAuthResult } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

import { query } from "@/common/lib/query"
import { GraphGQLAuthAdapter } from "@/features/auth/lib/graphql-auth-adapter"
import { signInFormSchema } from "@/validation/auth-validation"

export const {
  auth,
  handlers,
  signIn,
  signOut,
}: NextAuthResult = NextAuth({
  adapter: GraphGQLAuthAdapter,
  pages: {
    error: "/sign-in",
    signIn: "/sign-in",
  },
  providers: [
    Google,
    Credentials({
      // @todo: check if it will throw error. Maybe return null instead throwing error?
      // or check everything before calling signIn from next-auth
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
})
