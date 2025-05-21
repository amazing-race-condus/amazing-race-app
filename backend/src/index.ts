import express, { Response } from "express"
import { PrismaClient } from "../prisma/prisma/"
import cors from "cors"

const prisma = new PrismaClient()

const app = express()
app.use(cors())
app.use(express.json())
const port = 3000

import checkpointsRouter from "../controllers/checkpoints"
app.use("/checkpoints", checkpointsRouter)

app.get("/", (_, res: Response) => {
  res.send("Hello World!")
})

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});



export { app, server, prisma };
