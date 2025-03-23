import {
  DateTimeISOResolver,
  UUIDResolver,
} from "graphql-scalars"

import type { Resolver } from "@/graphql/lib/resolver-type"

export const rootScalarResolvers: Resolver = {
  DateTimeISO: DateTimeISOResolver,
  UUID: UUIDResolver,
}
