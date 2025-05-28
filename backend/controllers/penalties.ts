import express, { Response, Request } from "express"
import { prisma } from "../src/index"
// import { Type } from "../prisma/prisma/"

const penaltyRouter = express.Router()

penaltyRouter.get("/", async (req: Request, res: Response) => {
  const penalties = await prisma.penalty.findMany()

  res.json(penalties)
})


penaltyRouter.post("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const body = req.body

  const newPenalty = await prisma.penalty.create({
    data: {
      group_id: id,
      time: body.penalty_time,
    }
  })

  console.log("Body:", body)

  if (newPenalty) {
    res.json(newPenalty)
  } else {
    res.status(404).end()
  }
})

penaltyRouter.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const penalty = await prisma.penalty.findMany({
    where: { id },
  })
  if (penalty) {
    res.json(penalty)
  } else {
    res.status(404).end()
  }
})

penaltyRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const deletedPenalty = await prisma.penalty.deleteMany({
    where: { id },
  })

  if (deletedPenalty) {
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})


export default penaltyRouter
