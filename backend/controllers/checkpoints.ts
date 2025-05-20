import express, { Response, Request } from "express"
import { PrismaClient } from "../prisma/prisma/"
const checkpointsRouter = express.Router()

const prisma = new PrismaClient()


checkpointsRouter.get("/:id", async (req: Request, res: Response) => {

  const id = Number(req.params.id)

  const checkpoint = await prisma.checkpoint.findUnique({
    where: { id },
  })
  res.json(checkpoint)
})

checkpointsRouter.get("/", async (_, res: Response) => {

  const allCheckpoints = await prisma.checkpoint.findMany()

  res.send(allCheckpoints)
})

checkpointsRouter.post("/", async (req: Request, res: Response) => {
  const body = req.body
  const savedCheckpoint = await prisma.checkpoint.create({
    data: {
      name: body.name
    }
  })
  res.status(201).json(savedCheckpoint)
})

checkpointsRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  await prisma.checkpoint.delete({
    where: {
      id: Number(id),
    },
  })
  res.status(204).end()
})

export default checkpointsRouter
