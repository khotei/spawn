import {
  deepEqual,
  equal,
  ok,
  rejects,
} from "node:assert/strict"
import {
  afterEach,
  beforeEach,
  describe,
  test,
} from "node:test"

import { faker } from "@faker-js/faker"
import { cleanupDb, dbClient } from "@spawn/data-manager"
import { omit } from "lodash"

import { expectGraphQLError } from "@/graphql/tests/lib/expect-graphql-error"
import { query } from "@/graphql/tests/lib/query"
import { generateToken } from "@/lib/auth"

afterEach(async () => {
  await cleanupDb()
})

describe("Auth Resolvers", () => {
  describe("User Authentication", () => {
    const testUser = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    }

    beforeEach(async () => {
      await query.SignUp({
        input: testUser,
      })
    })

    test("should login successfully with valid credentials", async () => {
      const { signIn } = await query.SignIn({
        input: testUser,
      })

      ok(signIn, "User should be returned")
      deepEqual(
        {
          ...omit(testUser, "password"),
          emailVerified: null,
          image: null,
          name: null,
        },
        omit(signIn, "id")
      )
    })

    test("should throw error with invalid email", async () => {
      await rejects(
        query.SignIn({
          input: {
            email: "nonexistent@example.com",
            password: testUser.password,
          },
        }),
        (error: unknown) => {
          const errorWithMessage = error as {
            message: string
          }
          ok(
            errorWithMessage.message.includes(
              "Invalid email or password"
            )
          )
          return true
        }
      )
    })

    test("should throw error when registering with existing email", async () => {
      await rejects(
        query.SignUp({
          input: testUser,
        }),
        expectGraphQLError("Email already in use")
      )
    })

    test("should throw error with invalid password", async () => {
      await rejects(
        query.SignIn({
          input: {
            email: testUser.email,
            password: "wrongPassword123!",
          },
        }),
        expectGraphQLError("Invalid email or password")
      )
    })
  })

  describe("User Management", () => {
    test("should create a user", async () => {
      const userInput = {
        email: faker.internet.email(),
        image: faker.image.avatar(),
        name: faker.person.fullName(),
      }

      const { createUser } = await query.CreateUser({
        input: userInput,
      })

      ok(createUser.id, "User ID should be defined")
      equal(createUser.email, userInput.email)
      equal(createUser.name, userInput.name)
      equal(createUser.image, userInput.image)
    })

    test("should update a user", async () => {
      const { createUser } = await query.CreateUser({
        input: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
        },
      })

      const updatedName = faker.person.fullName()
      const { updateUser } = await query.UpdateUser({
        input: {
          id: createUser.id,
          name: updatedName,
        },
      })

      deepEqual(updateUser, {
        email: createUser.email,
        emailVerified: null,
        id: createUser.id,
        image: null,
        name: updatedName,
      })
    })

    test("should delete a user", async () => {
      const { createUser } = await query.CreateUser({
        input: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
        },
      })

      const { deleteUser } = await query.DeleteUser({
        input: { id: createUser.id },
      })

      deepEqual(deleteUser, createUser)

      const deletedUser = await dbClient.user.findUnique({
        where: { id: createUser.id },
      })
      equal(
        deletedUser,
        null,
        "User should be deleted from database"
      )
    })
  })

  describe("Account Management", () => {
    test("should link and unlink an account", async () => {
      const { createUser } = await query.CreateUser({
        input: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
        },
      })

      const linkData = {
        provider: "github",
        providerAccountId: faker.string.uuid(),
        type: "oauth",
        userId: createUser.id,
      }

      const { linkAccount } = await query.LinkAccount({
        input: linkData,
      })

      ok(
        linkAccount.id,
        "Linked account ID should be defined"
      )
      equal(linkAccount.provider, linkData.provider)
      equal(
        linkAccount.providerAccountId,
        linkData.providerAccountId
      )
      equal(linkAccount.userId, createUser.id)

      const { unlinkAccount } = await query.UnlinkAccount({
        input: {
          provider: linkData.provider,
          providerAccountId: linkData.providerAccountId,
        },
      })

      equal(unlinkAccount.id, linkAccount.id)

      const unlinkedAccount =
        await dbClient.account.findFirst({
          where: {
            provider: linkData.provider,
            providerAccountId: linkData.providerAccountId,
          },
        })
      equal(
        unlinkedAccount,
        null,
        "Account should be unlinked"
      )
    })
  })

  describe("Session Management", () => {
    test("should create, update and delete a session", async () => {
      const { createUser } = await query.CreateUser({
        input: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
        },
      })

      const expires = new Date()
      expires.setDate(expires.getDate() + 1)

      const sessionData = {
        expires,
        sessionToken: faker.string.uuid(),
        userId: createUser.id,
      }

      const { createSession } = await query.CreateSession({
        input: sessionData,
      })

      ok(createSession.id, "Session ID should be defined")
      equal(
        createSession.sessionToken,
        sessionData.sessionToken
      )
      equal(createSession.userId, createUser.id)
      ok(
        createSession.user,
        "Session should include user data"
      )

      const newExpires = new Date()
      newExpires.setDate(newExpires.getDate() + 7)

      const { updateSession } = await query.UpdateSession({
        input: {
          expires: newExpires,
          sessionToken: sessionData.sessionToken,
        },
      })

      equal(
        updateSession.sessionToken,
        sessionData.sessionToken
      )
      equal(
        new Date(updateSession.expires).getTime(),
        newExpires.getTime()
      )

      const { deleteSession } = await query.DeleteSession({
        input: { sessionToken: sessionData.sessionToken },
      })

      equal(
        deleteSession.sessionToken,
        sessionData.sessionToken
      )

      const deletedSession =
        await dbClient.session.findUnique({
          where: { sessionToken: sessionData.sessionToken },
        })
      equal(
        deletedSession,
        null,
        "Session should be deleted"
      )
    })
  })

  describe("Verification Token", () => {
    test("should create and verify a verification token", async () => {
      const email = faker.internet.email()
      const token = generateToken(24)
      const expires = new Date()
      expires.setHours(expires.getHours() + 24)

      const tokenData = {
        expires,
        identifier: email,
        token,
      }

      const { createVerificationToken } =
        await query.CreateVerificationToken({
          input: tokenData,
        })

      equal(createVerificationToken.identifier, email)
      equal(createVerificationToken.token, token)

      const { verifyToken } = await query.VerifyToken({
        input: {
          identifier: email,
          token,
        },
      })

      ok(
        verifyToken,
        "Verification token ID should be defined"
      )
      equal(verifyToken.identifier, email)
      equal(verifyToken.token, token)

      const consumedToken =
        await dbClient.verificationToken.findUnique({
          where: {
            identifier_token: {
              identifier: email,
              token,
            },
          },
        })
      equal(consumedToken, null, "Token should be consumed")
    })

    test("should throw error for expired token", async () => {
      const email = faker.internet.email()
      const token = generateToken(24)

      const expires = new Date()
      expires.setHours(expires.getHours() - 1)

      await dbClient.verificationToken.create({
        data: {
          expires,
          identifier: email,
          token,
        },
      })

      await rejects(
        query.VerifyToken({
          input: {
            identifier: email,
            token,
          },
        }),
        expectGraphQLError("Verification token expired")
      )
    })
  })

  describe("Queries", () => {
    test("should find user by id", async () => {
      const { createUser } = await query.CreateUser({
        input: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
        },
      })

      const { user } = await query.User({
        input: { id: createUser.id },
      })

      deepEqual(user, createUser)
    })

    test("should find user by email", async () => {
      const userData = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
      }

      const { createUser } = await query.CreateUser({
        input: userData,
      })

      const { userByEmail } = await query.UserByEmail({
        input: { email: userData.email },
      })

      deepEqual(userByEmail, createUser)
    })

    test("should find session", async () => {
      const { createUser } = await query.CreateUser({
        input: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
        },
      })

      const sessionToken = faker.string.uuid()
      const expires = new Date()
      expires.setDate(expires.getDate() + 1)

      const { createSession } = await query.CreateSession({
        input: {
          expires,
          sessionToken,
          userId: createUser.id,
        },
      })

      const { session } = await query.Session({
        input: { sessionToken },
      })

      deepEqual(session, createSession)
    })
  })
})
