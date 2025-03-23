import { createServer } from "node:http"

import { loadFilesSync } from "@graphql-tools/load-files"
import {
  mergeResolvers,
  mergeTypeDefs,
} from "@graphql-tools/merge"
import {
  createSchema,
  createYoga,
  type YogaInitialContext,
} from "graphql-yoga"

export type ServerOptions = {
  resolversPath: string
  typesPath: string
}

export type ServerContext = YogaInitialContext

export const createGraphQLServer = ({
  resolversPath,
  typesPath,
}: ServerOptions) => {
  const typeDefs = mergeTypeDefs(loadFilesSync(typesPath))
  const resolvers = mergeResolvers(
    loadFilesSync(resolversPath, {
      extractExports(fileExport) {
        return Object.values(fileExport)[0]
      },
    })
  )

  const isDevelopmentOrTest =
    process.env.NODE_ENV !== "production"

  const server = createServer(
    createYoga({
      maskedErrors: !isDevelopmentOrTest,
      schema: createSchema<ServerContext>({
        resolvers,
        typeDefs,
      }),
    })
  )

  return server
}

export type Server = ReturnType<typeof createGraphQLServer>
