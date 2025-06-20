import express from "express"
import { PrismaClient } from "../prisma/prisma"
import cors from "cors"
import path from "path"
import checkpointsRouter from "./routes/checkpoints.route"
import groupsRouter from "./routes/groups.route"
import routesRouter from "./routes/routes.route"
import penaltyRouter from "./routes/penalties.route"
import eventRouter from "./routes/event.route"
import authenticationRouter from "./routes/authentication.route"
import loginRouter from "./routes/login.route"
import { unknownEndpoint, errorHandler, tokenExtractor } from "./utils/middleware"

const prisma = new PrismaClient()

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "../public/dist")))
const port = 3000

app.use(tokenExtractor)

app.use("/api/checkpoints", checkpointsRouter)
app.use("/api/groups", groupsRouter)
app.use("/api/penalty", penaltyRouter)
app.use("/api/settings", routesRouter)
app.use("/api/event", eventRouter)
app.use("/api/authentication", authenticationRouter)
app.use("/api/login", loginRouter)

app.all("{*splat}", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "../public/dist", "index.html"))
  }
})

const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`) // eslint-disable-line no-console
})

app.use(unknownEndpoint)
app.use(errorHandler)

export { app, server, prisma }
