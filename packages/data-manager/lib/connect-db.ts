import { dbClient } from "@/lib/db-client"

export const connectDb = () => {
  return dbClient.$connect()
}
