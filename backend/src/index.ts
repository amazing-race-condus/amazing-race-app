import express from "express"
import { PrismaClient } from "../prisma/prisma/"
import cors from "cors"
import checkpointsRouter from "../controllers/checkpoints"
import { unknownEndpoint, errorHandler } from "../utils/middleware"

const prisma = new PrismaClient()

const app = express()
app.use(cors())
app.use(express.json())
const port = 3000

app.use("/checkpoints", checkpointsRouter)

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use(unknownEndpoint)
app.use(errorHandler)


export { app, server, prisma }
