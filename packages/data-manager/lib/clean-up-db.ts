import { dbClient } from "@/lib/db-client"

export const cleanupDb = async () => {
  await dbClient.verificationToken.deleteMany({})
  await dbClient.session.deleteMany({})
  await dbClient.account.deleteMany({})
  await dbClient.user.deleteMany({})
}
