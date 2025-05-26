import express, { Response, Request } from "express"
import { prisma } from "../src/index"
// import { Type } from "../prisma/prisma/"

const groupsRouter = express.Router()

groupsRouter.get("/:id", async (req: Request, res: Response) => {

  const id = Number(req.params.id)

  const group = await prisma.group.findUnique({
    where: { id },
  })
  if (group) {
    res.json(group)
  } else {
    res.status(404).end()
  }
})


groupsRouter.get("/", async (_, res: Response) => {

  const allGroups = await prisma.group.findMany()

  res.send(allGroups)
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

  const existingStart = await prisma.group.findFirst({
    where: { name: body.name }
  })
  if (existingStart) {
    res.status(400).json({ error: "Ryhmän nimi on jo käytössä. Syötä uniikki nimi" })
    return
  }

  const group = await prisma.group.create({
    data: {
      name: body.name,
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



export default groupsRouter
