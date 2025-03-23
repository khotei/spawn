import { transformScalars } from "@spawn/generate-graphql-code/dist/utils/transform-scalars"
import request from "supertest"

import { getSdk } from "@/__generated__/schema"
import { server } from "@/lib/server"

export const query = getSdk(async (doc, vars) => {
  const response = await request(server)
    .post("/graphql")
    .send({
      query: doc.loc?.source.body,
      variables: vars,
    })

  server.close()

  if (response.body.errors) {
    console.error(
      "GraphQL Error:",
      JSON.stringify(response.body.errors, null, 2)
    )
    throw new Error(JSON.stringify(response.body.errors))
  }

  return transformScalars(response.body.data)
})
