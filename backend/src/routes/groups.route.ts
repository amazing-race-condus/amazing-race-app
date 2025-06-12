import express, { Response, Request } from "express"
import { getGroupById, getAllGroups, getGroupByNextCheckpointId,
  updateNextCheckpoint, createGroup, deleteGroup, toggleDNF,
  toggleDisqualified, modifyGroup } from "../controllers/groups.controller"
import jwt from "jsonwebtoken"
import { User } from "@/types"

const groupsRouter = express.Router()

interface CustomRequest extends Request {
  token?: string | null
  user?: User | null
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

groupsRouter.get("/", async (_, res: Response) => {
  const groupsWithCheckpoints = await getAllGroups()

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

groupsRouter.post("/", async (req: CustomRequest, res: Response) => {
  const secret = process.env.SECRET
  if (!secret) {
    res.status(500).json({ error: "SECRET is not defined in environment." })
    return
  }
  const decodedToken = jwt.verify(req.token ?? "", secret) as jwt.JwtPayload
  if (!decodedToken.id) {
    res.status(400).end()
    return
  }
  const { name, members, easy } = req.body
  const group = await createGroup(name, members, easy, res)

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
  const { name, members, easy } = req.body

  const updatedGroup = await modifyGroup(id, name, members, easy, res)

  res.status(200).json(updatedGroup)

})

export default groupsRouter
