import process from "node:process"

import {
  connectDb,
  disconnectDb,
} from "@spawn/data-manager"

import { server } from "@/lib/server"

const main = async () => {
  console.log("Starting server 🚀")

  await connectDb()
  console.log("Database connected ✅")

  server.listen(4000, () => {
    const address = server.address()

    if (address && typeof address !== "string") {
      console.log(
        `GraphQL Server is listening on ${address.address.startsWith("::") ? "http://localhost:" : address.address}${address.port}/graphql 🚀`
      )
    }
  })

  process.on("SIGINT", async () => {
    console.log("Shutting down server 🚨")

    await disconnectDb()
    console.log("Database disconnected ✅")

    await new Promise<void>((resolve) => {
      server.close(() => {
        console.log("Server closed ✅")
        resolve()
      })
    })

    console.log("Server closed ✅")
  })
}

main()
