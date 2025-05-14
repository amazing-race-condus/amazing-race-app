import express, { Response } from "express"
import { PrismaClient } from "../prisma/prisma/"

const prisma = new PrismaClient

const app = express()
const port = 3000

app.get("/", (_, res: Response) => {
  res.send("Hello World!")
})

app.get("/ping", (_, res: Response) => {
  res.send("Pongee!")
})

app.get("/pipeline", async (_, res: Response) => {

  const allRastit = await prisma.rasti.findMany()

  res.send(allRastit)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


export default app;
