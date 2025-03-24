import process from "node:process"

import { transformScalars } from "@spawn/generate-graphql-code/dist/utils/transform-scalars"

import { getSdk } from "@/__generated__/schema"

export const query = getSdk(async (doc, vars) => {
  const response = await fetch(
    `${process.env.API_URL}/graphql`,
    {
      body: JSON.stringify({
        query: doc.loc?.source.body,
        variables: vars,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }
  )

  const { data, errors } = await response.json()

  if (errors?.length > 0) {
    throw new Error(JSON.stringify(errors, null, 2))
  } else if (!data) {
    throw new Error("No data returned from the server.")
  }

  return transformScalars(data)
})
