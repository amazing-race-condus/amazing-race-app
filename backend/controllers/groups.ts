import express, { Response, Request } from "express"
import { prisma } from "../src/index"

const groupsRouter = express.Router()

// USELESS in code but very useful in testing!!!
groupsRouter.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const group = await prisma.group.findUnique({
    where: { id },
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
  const orderedCheckpoints = group?.route?.routeSteps.map(step => step.checkpoint)
  if (group) {
    res.json(orderedCheckpoints)
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

  if (!body.name ) {
    res.status(400).json({ error: "Kaikkia vaadittuja tietoja ei ole annettu."})
    return
  }

  if  (body.name.length > 50 ) {
    res.status(400).json({ error: "Nimi on liian pitkä. Maksimi pituus on 100 kirjainta."})
    return
  }

  if (body.name.length < 2 ) {
    res.status(400).json({ error: "Nimi on liian lyhyt. Minimi pituus on 2 kirjainta."})
    return
  }

  if (body.members < 4) {
    res.status(400).json({ error: "Ryhmässä tulee olla vähintään 4 jäsentä." })
    return
  }

  if (body.members > 20) {
    res.status(400).json({ error: "WTF: monta teitä oikein on?" })
    return
  }

  const existingStart = await prisma.group.findFirst({
    where: { name: body.name }
  })
  if (existingStart) {
    res.status(400).json({ error: "Ryhmän nimi on jo käytössä. Syötä uniikki nimi." })
    return
  }

  const group = await prisma.group.create({
    data: {
      name: body.name,
      members: Number(body.members),
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

export default groupsRouter
