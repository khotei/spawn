export const baseCodegenConfig = {
  config: {
    avoidOptionals: {
      field: true,
    },
    dedupeFragments: true,
    enumsAsTypes: true,
    scalars: {
      DateTimeISO: {
        input: "Date",
        output: "Date",
      },
      UUID: {
        input: "string",
        output: "string",
      },
    },
    skipTypename: true,
    useIndexSignature: true,
  },
  plugins: [
    "typescript",
    "typescript-operations",
    "typescript-generic-sdk",
  ],
}
