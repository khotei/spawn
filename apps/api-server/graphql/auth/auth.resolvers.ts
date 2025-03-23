import { dbClient } from "@spawn/data-manager"
import { GraphQLError } from "graphql/error"

import type { Resolver } from "@/graphql/lib/resolver-type"
import {
  generateToken,
  hashPassword,
  verifyPassword,
} from "@/lib/auth"

export const authResolvers: Resolver = {
  Mutation: {
    createAccount: (__, { input }) => {
      return dbClient.account.create({
        data: input,
        include: { user: true },
      })
    },

    createSession: (__, { input }) => {
      return dbClient.session.create({
        data: input,
        include: { user: true },
      })
    },

    createUser: (__, { input }) => {
      return dbClient.user.create({ data: input })
    },

    createVerificationToken: (__, { input }) => {
      return dbClient.verificationToken.create({
        data: input,
      })
    },

    deleteAccount: async (__, { input }) => {
      const account =
        await dbClient.account.findFirstOrThrow({
          include: { user: true },
          where: input,
        })
      await dbClient.account.delete({ where: input })

      return account
    },

    deleteSession: async (__, { input }) => {
      const session =
        await dbClient.session.findFirstOrThrow({
          include: { user: true },
          where: input,
        })
      await dbClient.session.delete({
        where: input,
      })

      return session
    },

    deleteUser: async (__, { input }) => {
      const user = await dbClient.user.findFirstOrThrow({
        where: input,
      })
      await dbClient.user.delete({ where: input })

      return user
    },

    linkAccount: async (__, { input }) => {
      const { provider, providerAccountId, type, userId } =
        input

      const existingAccount =
        await dbClient.account.findFirst({
          include: { user: true },
          where: { provider, providerAccountId },
        })

      if (existingAccount) {
        return existingAccount
      }

      return dbClient.account.create({
        data: {
          provider,
          providerAccountId,
          type,
          userId,
        },
        include: { user: true },
      })
    },

    signIn: async (__, { input }) => {
      const { email, password } = input

      const user = await dbClient.user.findUnique({
        where: { email },
      })

      if (!user || !user.password) {
        throw new GraphQLError("Invalid email or password")
      }

      const validPassword = await verifyPassword(
        password,
        user.password
      )
      if (!validPassword) {
        throw new GraphQLError("Invalid email or password")
      }

      return user
    },

    signUp: async (__, { input }) => {
      const { email, password } = input

      const existingUser = await dbClient.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        throw new GraphQLError("Email already in use")
      }

      const hashedPassword = await hashPassword(password)
      const user = await dbClient.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      })

      const verificationToken = generateToken(24)
      const expires = new Date()
      expires.setHours(expires.getHours() + 24)

      await dbClient.verificationToken.create({
        data: {
          expires,
          identifier: email,
          token: verificationToken,
        },
      })

      // In a real app, send verification email here
      // sendVerificationEmail(email, verificationToken);

      return user
    },

    unlinkAccount: async (__, { input }) => {
      const account = await dbClient.account.findFirst({
        include: { user: true },
        where: input,
      })

      if (!account) {
        throw new GraphQLError("Account not found")
      }

      await dbClient.account.delete({
        where: {
          provider_providerAccountId: input,
        },
      })

      return account
    },

    updateSession: (__, { input }) => {
      const { expires, sessionToken, userId } = input

      return dbClient.session.update({
        data: {
          expires: expires ?? undefined,
          userId: userId ?? undefined,
        },
        include: { user: true },
        where: { sessionToken },
      })
    },

    updateUser: async (__, { input }) => {
      const { email, id, ...data } = input

      await dbClient.user.findFirstOrThrow({
        where: { id },
      })

      return dbClient.user.update({
        data: {
          ...data,
          email: email ?? undefined,
        },
        where: { id },
      })
    },

    verifyToken: async (__, { input }) => {
      const verificationToken =
        await dbClient.verificationToken.findUnique({
          where: {
            identifier_token: input,
          },
        })

      if (!verificationToken) {
        throw new GraphQLError(
          "Verification token not found"
        )
      }

      if (
        new Date(verificationToken.expires) < new Date()
      ) {
        throw new GraphQLError("Verification token expired")
      }

      await dbClient.verificationToken.delete({
        where: { identifier_token: input },
      })

      return verificationToken
    },
  },
  Query: {
    account: async (__, { input }) => {
      return dbClient.account.findUnique({
        include: { user: true },
        where: {
          provider_providerAccountId: input,
        },
      })
    },

    session: async (__, { input }) => {
      return dbClient.session.findUnique({
        include: { user: true },
        where: input,
      })
    },

    user: async (__, { input }) => {
      return dbClient.user.findUnique({ where: input })
    },

    userByEmail: async (__, { input }) => {
      return dbClient.user.findUnique({ where: input })
    },

    userByProviderUserId: async (__, { input }) => {
      const { providerUserId } = input

      const account =
        await dbClient.account.findFirstOrThrow({
          include: { user: true },
          where: { providerAccountId: providerUserId },
        })

      return account.user
    },
  },
}
