import express, { Response, Request } from "express"
import { getGroupById, getAllGroups, getGroupByNextCheckpointId,
  updateNextCheckpoint, createGroup, deleteGroup, toggleDNF,
  toggleDisqualified, modifyGroup } from "../controllers/groups.controller"

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

groupsRouter.get("/", async (req: Request, res: Response) => {
  const eventId = Number(req.query.eventId)
  const groupsWithCheckpoints = await getAllGroups(eventId)

  res.send(groupsWithCheckpoints)
})

groupsRouter.get("/by_next_checkpoint/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const arrivingGroups = await getGroupByNextCheckpointId(id)

  res.json(arrivingGroups)
})

groupsRouter.put("/next_checkpoint/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const body = req.body

  const arrivingGroups = await updateNextCheckpoint(id, body.nextCheckpointId)

  res.json(arrivingGroups)
})

groupsRouter.post("/", async (req: Request, res: Response) => {

  const { name, members, easy, eventId } = req.body
  const group = await createGroup(name, members, easy, eventId, res)

  res.json(group)
})

groupsRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const group = await deleteGroup(id)
  if (group) {
    res.json(group)
  } else {
    res.status(404).end()
  }
})

groupsRouter.put("/:id/dnf", async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const group = await toggleDNF(id)

  if (group) {
    res.json(group)
  } else {
    res.status(404).json({ error: "Ryhmää ei löydy" })
  }
})

groupsRouter.put("/:id/disqualify", async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const group = await toggleDisqualified(id)

  if (group) {
    res.json(group)
  } else {
    res.status(404).json({ error: "Ryhmää ei löydy" })
  }
})

groupsRouter.put("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const { name, members, easy, eventId } = req.body

  const updatedGroup = await modifyGroup(id, name, members, easy, eventId , res)

  res.status(200).json(updatedGroup)

})

export default groupsRouter
