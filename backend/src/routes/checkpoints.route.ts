import express, { Response, Request } from "express"
import { getAllCheckpoints, getCheckpointById, createCheckpoint,
  deleteCheckpoint, modifyCheckpoint } from "../controllers/checkpoints.controller"
import { verifyToken } from "../utils/middleware"
import { User } from "@/types"

const checkpointsRouter = express.Router()

interface CustomRequest extends Request {
  user?: User
}

checkpointsRouter.get("/", verifyToken, async (req: Request, res: Response) => {

  // const allCheckpoints = await getAllCheckpoints()
  const eventId = Number(req.query.eventId)

  const allCheckpoints = await getAllCheckpoints(eventId)

  res.send(allCheckpoints)
})

checkpointsRouter.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const checkpoint = await getCheckpointById(id)
  if (checkpoint) {
    res.json(checkpoint)
  } else {
    res.status(404).end()
  }
})

checkpointsRouter.post("/", verifyToken, async (req: CustomRequest, res: Response) => {
  const user = req.user
  if (!user || user.admin !== true) {
    res.status(401).json({ error:"Tämä toiminto on sallittu vain pääkäyttäjälle"})
    return
  }

  const body = req.body

  const savedCheckpoint = await createCheckpoint(body, res)

  res.status(201).json(savedCheckpoint)
})

checkpointsRouter.delete("/:id", verifyToken, async (req: CustomRequest, res: Response) => {
  const user = req.user
  if (!user || user.admin !== true) {
    res.status(401).json({ error:"Tämä toiminto on sallittu vain pääkäyttäjälle"})
    return
  }
  const id = Number(req.params.id)

  deleteCheckpoint(id)

  res.status(204).end()
})

checkpointsRouter.put("/:id", verifyToken, async (req: CustomRequest, res: Response) => {
  const user = req.user
  if (!user || user.admin !== true) {
    res.status(401).json({ error:"Tämä toiminto on sallittu vain pääkäyttäjälle"})
    return
  }
  const id = Number(req.params.id)
  const { eventId, name, type, hint, easyHint } = req.body
  const updatedCheckpoint = await modifyCheckpoint(id, eventId, name, type, hint, easyHint, res)

  res.status(200).json(updatedCheckpoint)

})

export default checkpointsRouter


