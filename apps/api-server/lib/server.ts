import path from "node:path"

import { createGraphQLServer } from "@spawn/graphql-server"

export const server = createGraphQLServer({
  resolversPath: path.join(
    __dirname,
    "../graphql/**/*.resolvers.ts"
  ),
  typesPath: path.join(
    __dirname,
    "../graphql/**/*.graphql"
  ),
})
