import { join } from "node:path"

import type { CodegenConfig } from "@graphql-codegen/cli"
import { merge } from "lodash"

import { baseCodegenConfig } from "@/lib/base-code-gen-config"
import { getExecPath } from "@/utils/get-exec-path"

export const createCodegenConfig = (options: {
  additionalPlugins?: string[]
  isClient?: boolean
}): CodegenConfig => {
  const { additionalPlugins = [], isClient = false } =
    options
  const execPath = getExecPath()

  const basePath = isClient ? "../api-server" : ""

  return {
    documents: join(execPath, basePath, "**/*.graphql"),
    generates: {
      [join(execPath, "__generated__/schema.ts")]: merge(
        {},
        baseCodegenConfig,
        {
          plugins: [
            ...baseCodegenConfig.plugins,
            ...additionalPlugins,
          ],
        }
      ),
    },
    schema: join(execPath, basePath, "**/*.graphql"),
  }
}
