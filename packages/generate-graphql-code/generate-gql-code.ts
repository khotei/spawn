import {
  type CodegenConfig,
  generate,
} from "@graphql-codegen/cli"
import { merge } from "lodash"

import { createCodegenConfig } from "@/lib/create-code-gen-config"

const gqlWebCodegenConfig = createCodegenConfig({
  isClient: true,
})

const gqlApiCodegenConfig = createCodegenConfig({
  additionalPlugins: ["typescript-resolvers"],
  isClient: false,
})

export const generateAPIGraphqlTypes = async (
  options: {
    config?: Partial<CodegenConfig>
    isClient?: boolean
  } = {}
) => {
  const { config = {}, isClient = false } = options
  const baseConfig = isClient
    ? gqlWebCodegenConfig
    : gqlApiCodegenConfig

  await generate(merge({}, baseConfig, config))
}

export const generateWebGraphqlTypes = async (
  config: Partial<CodegenConfig> = {}
) => {
  return generateAPIGraphqlTypes({ config, isClient: true })
}
