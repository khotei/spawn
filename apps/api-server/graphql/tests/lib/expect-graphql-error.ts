import { ok } from "node:assert/strict"

export const expectGraphQLError =
  (expectedMessage: string) =>
  (error: unknown): boolean => {
    if (!(error instanceof Error)) {
      throw new Error(
        `Expected Error object, but got ${typeof error}`
      )
    }

    if (
      "graphQLErrors" in error &&
      Array.isArray((error as any).graphQLErrors)
    ) {
      const { graphQLErrors } = error as any
      return graphQLErrors.some((gqlError: any) =>
        gqlError.message?.includes(expectedMessage)
      )
    }

    ok(
      error.message.includes(expectedMessage),
      `Expected error message to contain "${expectedMessage}", but got "${error.message}"`
    )

    return true
  }
