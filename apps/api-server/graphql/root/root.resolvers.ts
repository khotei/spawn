import { type Resolver } from "@/graphql/lib/resolver-type"

export const rootResolvers: Resolver = {
  Query: {
    healthCheck: () => ({
      apiStatus: "ok",
    }),
  },
}
