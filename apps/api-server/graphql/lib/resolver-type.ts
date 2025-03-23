import { ServerContext } from "@spawn/graphql-server"

import { Resolvers } from "@/__generated__/schema"

export type Resolver = Resolvers<ServerContext>
