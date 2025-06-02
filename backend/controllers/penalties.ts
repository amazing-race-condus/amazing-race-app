import express, { Response, Request } from "express"
import { prisma } from "../src/index"

const penaltyRouter = express.Router()

penaltyRouter.get("/", async (req: Request, res: Response) => {
  const penalties = await prisma.penalty.findMany()

  res.json(penalties)
})

penaltyRouter.post("/:groupid", async (req: Request, res: Response) => {
  const id = Number(req.params.groupid)
  const body = req.body

  const newPenalty = await prisma.penalty.create({
    data: {
      groupId: id,
      time: body.penaltyTime,
      type: body.penaltyType,
      checkpointId: body.checkpointId
    }
  })

  if (newPenalty) {
    res.json(newPenalty)
  } else {
    res.status(404).end()
  }
})

penaltyRouter.get("/:groupid", async (req: Request, res: Response) => {
  const id = Number(req.params.groupid)

  const penalty = await prisma.penalty.findMany({
    where: { groupId : id },
  })
  if (penalty) {
    res.json(penalty)
  } else {
    res.status(404).end()
  }
})

penaltyRouter.delete("/:penaltyid", async (req: Request, res: Response) => {
  const id = Number(req.params.penaltyid)

  const deletedPenalty = await prisma.penalty.delete({
    where: { id },
  })

  if (deletedPenalty) {
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

penaltyRouter.delete("/all/:groupid", async (req: Request, res: Response) => {
  const id = Number(req.params.groupid)
  const groupsPenalties = await prisma.penalty.deleteMany({
    where: { groupId : id }
  })

  if (groupsPenalties) {
    res.json(groupsPenalties)
  } else {
    res.status(404).end()
  }
})


export default penaltyRouter
