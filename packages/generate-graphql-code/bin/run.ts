#! /usr/bin/env node
import {
  generateAPIGraphqlTypes,
  generateWebGraphqlTypes,
} from "@spawn/generate-graphql-code"

const hasWebArgument = process.argv.includes("--web")

if (hasWebArgument) {
  generateWebGraphqlTypes()
} else {
  generateAPIGraphqlTypes()
}
