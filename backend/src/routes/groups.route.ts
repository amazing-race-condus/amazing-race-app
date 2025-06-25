import express, { Response, Request } from "express"
import { getGroupById, getAllGroups, getGroupByNextCheckpointId,
  updateNextCheckpoint, createGroup, deleteGroup, toggleDNF,
  toggleDisqualified, modifyGroup } from "../controllers/groups.controller"
import { verifyToken } from "../utils/middleware"
import { User } from "@/types"

const groupsRouter = express.Router()

interface CustomRequest extends Request {
  user?: User
}

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

groupsRouter.get("/", verifyToken, async (req: Request, res: Response) => {
  const eventId = Number(req.query.eventId)
  const groupsWithCheckpoints = await getAllGroups(eventId)

  res.send(groupsWithCheckpoints)
})

groupsRouter.get("/by_next_checkpoint/:id", verifyToken, async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const arrivingGroups = await getGroupByNextCheckpointId(id)

  res.json(arrivingGroups)
})

groupsRouter.put("/next_checkpoint/:id", verifyToken, async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const body = req.body

  const updatedGroup = await updateNextCheckpoint(id, body.nextCheckpointId)

  req.app.get("io").emit("group:updated", updatedGroup)

  res.json(updatedGroup)
})

groupsRouter.post("/", verifyToken, async (req: CustomRequest, res: Response) => {
  const user = req.user
  if (!user || user.admin !== true) {
    res.status(401).json({ error:"Tämä toiminto on sallittu vain pääkäyttäjälle"})
    return
  }

  const { name, members, easy, eventId } = req.body
  const group = await createGroup(name, members, easy, eventId, res)

  req.app.get("io").emit("group:created", group)

  res.json(group)
})

groupsRouter.delete("/:id", verifyToken, async (req: CustomRequest, res: Response) => {
  const user = req.user
  if (!user || user.admin !== true) {
    res.status(401).json({ error:"Tämä toiminto on sallittu vain pääkäyttäjälle"})
    return
  }
  const id = Number(req.params.id)

  const group = await deleteGroup(id)
  if (group) {
    req.app.get("io").emit("group:deleted", group)
    res.json(group)
  } else {
    res.status(404).end()
  }
})

groupsRouter.put("/:id/dnf", verifyToken, async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const group = await toggleDNF(id)

  if (group) {
    req.app.get("io").emit("group:updated", group)
    res.json(group)
  } else {
    res.status(404).json({ error: "Ryhmää ei löydy" })
  }
})

groupsRouter.put("/:id/disqualify", verifyToken, async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const group = await toggleDisqualified(id)

  if (group) {
    req.app.get("io").emit("group:updated", group)
    res.json(group)
  } else {
    res.status(404).json({ error: "Ryhmää ei löydy" })
  }
})

groupsRouter.put("/:id", verifyToken, async (req: CustomRequest, res: Response) => {
  const user = req.user
  if (!user || user.admin !== true) {
    res.status(401).json({ error:"Tämä toiminto on sallittu vain pääkäyttäjälle"})
    return
  }
  const id = Number(req.params.id)
  const { name, members, easy, eventId } = req.body

  const updatedGroup = await modifyGroup(id, name, members, easy, eventId , res)

  req.app.get("io").emit("group:updated", updatedGroup)

  res.status(200).json(updatedGroup)
})

export default groupsRouter
