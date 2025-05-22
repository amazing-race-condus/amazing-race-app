import express from "express"
import { PrismaClient } from "../prisma/prisma/"
import cors from "cors"
import path from "path"
import checkpointsRouter from "../controllers/checkpoints"
import { unknownEndpoint, errorHandler } from "../utils/middleware"
import settingsRouter from "../controllers/settings"

const prisma = new PrismaClient()

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "../public/dist")))
const port = 3000

app.use("/api/checkpoints", checkpointsRouter)
app.use("/api/settings", settingsRouter)

app.all("{*splat}", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "../public/dist", "index.html"))
  }
})
app.use("/api/checkpoints", checkpointsRouter)
app.use("/api/settings", settingsRouter)

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use(unknownEndpoint)
app.use(errorHandler)

export { app, server, prisma }
