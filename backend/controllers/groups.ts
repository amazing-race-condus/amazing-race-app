import express, { Response, Request } from "express"
import { prisma } from "../src/index"
import { validateName, validateMembers } from "../utils/groupValidators"

const groupsRouter = express.Router()

// USELESS in code but very useful in testing!!!
groupsRouter.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const group = await prisma.group.findUnique({
    where: { id: id },
    include: {
      penalty: true,
      route: {
        include: {
          routeSteps: {
            orderBy: { checkpointOrder: "asc" },
            include: {
              checkpoint: true
            }
          }
        }
      }
    }
  })

  const groupWithCheckpoints = group
    ? {
      ...group,
      route: group.route?.routeSteps.map(step => step.checkpoint) ?? []
    }
    : null

  if (group) {
    res.json(groupWithCheckpoints)
  } else {
    res.status(404).end()
  }
})

groupsRouter.get("/", async (_, res: Response) => {
  const groups = await prisma.group.findMany({
    include: {
      penalty: true,
      route: {
        include: {
          routeSteps: {
            orderBy: { checkpointOrder: "asc" },
            include: {
              checkpoint: true
            }
          }
        }
      }
    }
  })

  const groupsWithCheckpoints = groups.map(group => ({
    ...group,
    route: group.route?.routeSteps.map(step => step.checkpoint) ?? []
  }))

  res.send(groupsWithCheckpoints)
})

groupsRouter.get("/by_next_checkpoint/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const arrivingGroups = await prisma.group.findMany({ where: { nextCheckpointId: id } })

  res.json(arrivingGroups)
})

groupsRouter.put("/next_checkpoint/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const body = req.body

  const arrivingGroups = await prisma.group.update({
    where: { id: id }
    , data: {
      nextCheckpointId: body.nextCheckpointId
    }
  })

  res.json(arrivingGroups)
})

groupsRouter.post("/", async (req: Request, res: Response) => {
  const body = req.body

  if (!body.name || !body.members) {
    res.status(400).json({ error: "Kaikkia vaadittuja tietoja ei ole annettu."})
    return
  }

  const validName = await validateName(body.name, res)
  if (!validName) {
    return
  }

  const validMembers = validateMembers(body.members, res)
  if (!validMembers) {
    return
  }

  const group = await prisma.group.create({
    data: {
      name: body.name,
      members: Number(body.members),
      easy: body.easy
    }
  })

  res.json(group)
})

groupsRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const group = await prisma.group.delete({
    where: { id },
  })
  if (group) {
    res.json(group)
  } else {
    res.status(404).end()
  }
})

groupsRouter.put("/:id/dnf", async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const existingGroup = await prisma.group.findUnique({
    where: { id },
    select: { dnf: true },
  })

  const group = await prisma.group.update({
    where: { id },
    data: { dnf: !existingGroup?.dnf },
  })

  if (group) {
    res.json(group)
  } else {
    res.status(404).json({ error: "Ryhmää ei löydy" })
  }
  return
})

groupsRouter.put("/:id/disqualify", async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const existingGroup = await prisma.group.findUnique({
    where: { id },
    select: { disqualified: true },
  })

  const group = await prisma.group.update({
    where: { id },
    data: { disqualified: !existingGroup?.disqualified },
  })

  if (group) {
    res.json(group)
  } else {
    res.status(404).json({ error: "Ryhmää ei löydy" })
  }
  return
})

groupsRouter.put("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  const { name, members, easy } = req.body

  const data: Partial<{ name: string, members: number, easy: boolean }> = {}

  const groupToModify = await prisma.group.findUnique({
    where: { id },
  })

  if (!groupToModify) {
    res.status(404).json({ error: "Ryhmää ei löydy" })
    return
  }

  const validName = await validateName(name, res)
  if (!validName) {
    return
  }

  const validMembers = validateMembers(members, res)
  if (!validMembers) {
    return
  }

  if (easy !== undefined) data.easy = easy
  if (name !== undefined) data.name = name
  if (members !== undefined) data.members = Number(members)

  const updatedGroup = await prisma.group.update({
    where: { id },
    data
  })


  res.status(200).json(updatedGroup)

})

export default groupsRouter
