import express from "express"
import { PrismaClient } from "../prisma/prisma"
import cors from "cors"
import path from "path"
import checkpointsRouter from "./routes/checkpoints.route"
import groupsRouter from "./routes/groups.route"
import routesRouter from "./routes/routes.route"
import penaltyRouter from "./routes/penalties.route"
import eventRouter from "./routes/event.route"
import { unknownEndpoint, errorHandler } from "./utils/middleware"

const prisma = new PrismaClient()

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "../public/dist")))
const port = 3000

app.use("/api/checkpoints", checkpointsRouter)
app.use("/api/groups", groupsRouter)
app.use("/api/penalty", penaltyRouter)
app.use("/api/settings", routesRouter)
app.use("/api/event", eventRouter)

app.all("{*splat}", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "../public/dist", "index.html"))
  }
})

const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`) // eslint-disable-line no-console
})

setInterval(async () => {
  try {
    const result = await prisma.$queryRaw`SELECT count(*) as connections FROM pg_stat_activity WHERE datname = current_database();`
    console.log("Active DB connections:", result)
  } catch (error) {
    console.error("Failed to check connections:", error)
  }
}, 5000)

app.use(unknownEndpoint)
app.use(errorHandler)

export { app, server, prisma }
