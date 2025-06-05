import express, { Response, Request } from "express"
import { getPenalties, createPenalty, getPenaltyByGroup, deletePenalty,
  deleteAllPenaltiesOfGroup } from "../controllers/penalties.controller"

const penaltyRouter = express.Router()

penaltyRouter.get("/", async (req: Request, res: Response) => {
  const penalties = await getPenalties()
  res.json(penalties)
})

penaltyRouter.post("/:groupid", async (req: Request, res: Response) => {
  const id = Number(req.params.groupid)
  const body = req.body
  const newPenalty = await createPenalty(id, body)

  if (newPenalty) {
    res.json(newPenalty)
  } else {
    res.status(404).end()
  }
})

penaltyRouter.get("/:groupid", async (req: Request, res: Response) => {
  const groupId = Number(req.params.groupid)

  const penalty = await getPenaltyByGroup(groupId)
  if (penalty) {
    res.json(penalty)
  } else {
    res.status(404).end()
  }
})

penaltyRouter.delete("/:penaltyid", async (req: Request, res: Response) => {
  const id = Number(req.params.penaltyid)

  const deletedPenalty = await deletePenalty(id)

  if (deletedPenalty) {
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})

penaltyRouter.delete("/all/:groupid", async (req: Request, res: Response) => {
  const id = Number(req.params.groupid)
  const groupsPenalties = await deleteAllPenaltiesOfGroup(id)

  if (groupsPenalties) {
    res.json(groupsPenalties)
  } else {
    res.status(404).end()
  }
})


export default penaltyRouter
