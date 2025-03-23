import { mapValues } from "lodash"

const shouldConvertToDate = (value: string): boolean => {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/u.test(value)
}

export const transformScalars = (data: unknown): any => {
  if (!data) {
    return data
  }

  if (Array.isArray(data)) {
    return data.map(transformScalars)
  }

  if (typeof data === "object") {
    return mapValues(data, transformScalars)
  }

  if (
    typeof data === "string" &&
    shouldConvertToDate(data)
  ) {
    return new Date(data)
  }

  return data
}
