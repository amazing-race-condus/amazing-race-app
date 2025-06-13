import express, { Response, Request } from "express"
import { getAllCheckpoints, getCheckpointById, createCheckpoint,
  deleteCheckpoint, modifyCheckpoint } from "../controllers/checkpoints.controller"
import { verifyToken } from "../utils/middleware"

const checkpointsRouter = express.Router()

checkpointsRouter.get("/", async (req: Request, res: Response) => {

  // const allCheckpoints = await getAllCheckpoints()
  const eventId = Number(req.query.eventId)

  const allCheckpoints = await getAllCheckpoints(eventId)

  res.send(allCheckpoints)
})

checkpointsRouter.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const checkpoint = await getCheckpointById(id)
  if (checkpoint) {
    res.json(checkpoint)
  } else {
    res.status(404).end()
  }
})

checkpointsRouter.post("/", verifyToken, async (req: Request, res: Response) => {
  const body = req.body

  const savedCheckpoint = await createCheckpoint(body, res)

  res.status(201).json(savedCheckpoint)
})

checkpointsRouter.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  deleteCheckpoint(id)

  res.status(204).end()
})

checkpointsRouter.put("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const { name, type, hint, easyHint } = req.body
  const updatedCheckpoint = await modifyCheckpoint(id, name, type, hint, easyHint, res)

  res.status(200).json(updatedCheckpoint)

})

export default checkpointsRouter


