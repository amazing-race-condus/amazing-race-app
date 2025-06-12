import express, { Response, Request } from "express"
import { getGroupById, getAllGroups, getGroupByNextCheckpointId,
  updateNextCheckpoint, createGroup, deleteGroup, toggleDNF,
  toggleDisqualified, modifyGroup } from "../controllers/groups.controller"
import { verifyToken } from "../utils/middleware"

const groupsRouter = express.Router()


// Used in testing
groupsRouter.get("/:id", async (req: Request, res: Response) => {

  const id = Number(req.params.id)
  const groupWithCheckpoints = await getGroupById(id)

  if (groupWithCheckpoints) {
    res.json(groupWithCheckpoints)
  } else {
    res.status(404).end()
  }
})

groupsRouter.get("/", async (_, res: Response) => {
  const groupsWithCheckpoints = await getAllGroups()

  res.send(groupsWithCheckpoints)
})

groupsRouter.get("/by_next_checkpoint/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const arrivingGroups = await getGroupByNextCheckpointId(id)

  res.json(arrivingGroups)
})

groupsRouter.put("/next_checkpoint/:id", verifyToken, async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const body = req.body

  const arrivingGroups = await updateNextCheckpoint(id, body.nextCheckpointId)

  res.json(arrivingGroups)
})

groupsRouter.post("/", verifyToken, async (req: Request, res: Response) => {

  const { name, members, easy } = req.body
  const group = await createGroup(name, members, easy, res)

  res.json(group)
})

groupsRouter.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const group = await deleteGroup(id)
  if (group) {
    res.json(group)
  } else {
    res.status(404).end()
  }
})

groupsRouter.put("/:id/dnf", verifyToken, async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const group = await toggleDNF(id)

  if (group) {
    res.json(group)
  } else {
    res.status(404).json({ error: "Ryhmää ei löydy" })
  }
})

groupsRouter.put("/:id/disqualify", verifyToken, async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const group = await toggleDisqualified(id)

  if (group) {
    res.json(group)
  } else {
    res.status(404).json({ error: "Ryhmää ei löydy" })
  }
})

groupsRouter.put("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const { name, members, easy } = req.body

  const updatedGroup = await modifyGroup(id, name, members, easy, res)

  res.status(200).json(updatedGroup)

})

export default groupsRouter
