import { ok } from "node:assert"

import { dbClient, Prisma } from "@spawn/data-manager"
import { GraphQLError } from "graphql/error"

import type { Resolver } from "@/graphql/lib/resolver-type"
import {
  generateToken,
  hashPassword,
  verifyPassword,
} from "@/lib/auth"
import {
  createAccount,
  createSession,
  createVerificationToken,
  deleteAccount,
  deleteSession,
  deleteVerificationToken,
  findAccount,
  findUniqueAccount,
  findUniqueSession,
  findUniqueVerificationToken,
  getSession,
  updateSession,
} from "@/store/auth.store"
import {
  createUser,
  deleteUser,
  findUniqueUser,
  getUser,
  updateUser,
} from "@/store/users.store"

export const authResolvers: Resolver = {
  Mutation: {
    createSession: (__, { input }) => {
      return createSession(input)
    },

    createUser: (__, { input }) => {
      return createUser(input)
    },

    createVerificationToken: (__, { input }) => {
      return createVerificationToken(input)
    },

    deleteSession: async (__, { input }) => {
      const session = await getSession(input)

      await deleteSession(input)

      return session
    },

    deleteUser: async (__, { input }) => {
      const user = await getUser(input)

      await deleteUser(input)

      return user
    },

    linkAccount: async (__, { input }) => {
      const findOrCreate = async <
        Find extends typeof findAccount,
        Create extends typeof createAccount,
      >(
        find: Find,
        create: Create
      ) => (await find(input)) ?? (await create(input))

      return findOrCreate(findAccount, createAccount)
    },

    signIn: async (__, { input }) => {
      const { email, password } = input

      const user = await findUniqueUser({ email })

      ok(
        user?.password,
        new GraphQLError("Invalid email or password")
      )

      const validPassword = await verifyPassword(
        password,
        user.password
      )

      ok(
        validPassword,
        new GraphQLError("Invalid email or password")
      )

      return user
    },

    signUp: async (__, { input }) => {
      const { email, password } = input

      const existingUser = await findUniqueUser({ email })

      ok(
        !existingUser,
        new GraphQLError("Email already in use")
      )

      const hashedPassword = await hashPassword(password)
      const user = await createUser({
        email,
        password: hashedPassword,
      })

      const verificationToken = generateToken(24)
      const expires = new Date()
      expires.setHours(expires.getHours() + 24)

      await createVerificationToken({
        expires,
        identifier: email,
        token: verificationToken,
      })

      // In a real app, send verification email here
      // sendVerificationEmail(email, verificationToken);

      return user
    },

    unlinkAccount: async (__, { input }) => {
      const account = await findAccount(input)

      ok(account, new GraphQLError("Account not found"))

      await deleteAccount(input)

      return account
    },

    updateSession: (__, { input }) => {
      return updateSession(input)
    },

    updateUser: async (__, { input }) => {
      const { id } = input

      await getUser({ id })

      return updateUser(input)
    },

    verifyToken: async (__, { input }) => {
      const verificationToken =
        await findUniqueVerificationToken(input)

      ok(
        verificationToken,
        new GraphQLError("Verification token not found")
      )

      ok(
        new Date(verificationToken.expires) < new Date(),
        new GraphQLError("Verification token expired")
      )

      // get user from token and verify
      await deleteVerificationToken(input)

      return verificationToken
    },
  },
  Query: {
    account: async (__, { input }) => {
      return findUniqueAccount(input)
    },

    session: async (__, { input }) => {
      return findUniqueSession(input)
    },

    user: async (__, { input }) => {
      return findUniqueUser(input)
    },

    userByAccount: async (__, { input }) => {
      const account = await findAccount(input)

      return account?.user ?? null
    },

    userByEmail: async (__, { input }) => {
      return findUniqueUser(input)
    },
  },
}
