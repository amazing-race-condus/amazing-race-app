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
import http from "http"
import { Server as SocketIOServer } from "socket.io"

const PORT = 3000
const prisma = new PrismaClient()

const app = express()

const httpServer = http.createServer(app)
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*"
  }
})

io.on("connection", (socket) => {
  console.log("connedted:", socket.id)

  socket.on("disconnect", () => {
    console.log("disconnected", socket.id)
  })
})

app.set("io", io)
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "../public/dist")))
app.use(tokenExtractor)

app.use("/api/authentication", authenticationRouter)
app.use("/api/checkpoints", checkpointsRouter)
app.use("/api/groups", groupsRouter)
app.use("/api/penalty", penaltyRouter)
app.use("/api/settings", routesRouter)
app.use("/api/event", eventRouter)
app.use("/api/login", loginRouter)

app.all("{*splat}", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "../public/dist", "index.html"))
  }
})

app.use(unknownEndpoint)
app.use(errorHandler)

const server = httpServer.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`) // eslint-disable-line no-console
})


export { app, server, prisma }
