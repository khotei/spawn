import { equal } from "node:assert/strict"
import { describe, test } from "node:test"

import { query } from "@/graphql/tests/lib/query"

describe("Root Resolver", () => {
  test('healthCheck returns "ok"', async () => {
    const {
      healthCheck: { apiStatus },
    } = await query.HealthCheck()
    equal(apiStatus, "ok")
  })
})
