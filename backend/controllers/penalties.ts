import express, { Response, Request } from "express"
import { prisma } from "../src/index"
// import { Type } from "../prisma/prisma/"

const penaltyRouter = express.Router()

penaltyRouter.get("/", async (req: Request, res: Response) => {
  const penalties = await prisma.penalty.findMany()

  res.json(penalties)
})

// Create a new penalty for a group by (Group) ID

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

// Get all penalties for a group by (Group) ID

penaltyRouter.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const penalty = await prisma.penalty.findMany({
    where: { group_id : id },
  })
  if (penalty) {
    res.json(penalty)
  } else {
    res.status(404).end()
  }
})

// Delete a penalty by (Penalty) ID

penaltyRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const deletedPenalty = await prisma.penalty.delete({
    where: { id },
  })

  if (deletedPenalty) {
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

penaltyRouter.delete("/all/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const allGroups = await prisma.penalty.deleteMany({
    where: { group_id : id }
  })

  if (allGroups) {
    res.json(allGroups)
  } else {
    res.status(404).end()
  }
})


export default penaltyRouter
