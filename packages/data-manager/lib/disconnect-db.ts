import { dbClient } from "@/lib/db-client"

export const disconnectDb = () => {
  return dbClient.$disconnect()
}
