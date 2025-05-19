import express, { Response, Request } from "express"
import { PrismaClient } from "../prisma/prisma/"
import cors from "cors"

const prisma = new PrismaClient()

const app = express()
app.use(cors())
app.use(express.json())
const port = 3000

app.get("/", (_, res: Response) => {
  res.send("Hello World!")
})

app.get("/ping", (_, res: Response) => {
  res.send("Pongee!")
})

app.get("/checkpoints", async (_, res: Response) => {

  const allCheckpoints = await prisma.checkpoint.findMany()

  res.send(allCheckpoints)
})

app.post("/checkpoints", async (req: Request, res: Response) => {
  const body = req.body
  const savedCheckpoint = await prisma.checkpoint.create({
    data: {
      name: body.name
    }
  })
  console.log(savedCheckpoint)
  res.status(201).json(savedCheckpoint)
})

app.delete("/checkpoints/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  await prisma.checkpoint.delete({
    where: {
      id: Number(id),
    },
  })
  res.status(204).end()
})

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export { app, server, prisma };
