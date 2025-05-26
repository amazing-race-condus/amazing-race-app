import express, { Response, Request } from "express"
import { prisma } from "../src/index"
import { Type } from "../prisma/prisma/"

const checkpointsRouter = express.Router()


checkpointsRouter.get("/:id", async (req: Request, res: Response) => {

  const id = Number(req.params.id)

  const checkpoint = await prisma.checkpoint.findUnique({
    where: { id },
  })
  if (checkpoint) {
    res.json(checkpoint)
  } else {
    res.status(404).end()
  }
})


checkpointsRouter.get("/", async (_, res: Response) => {

  const allCheckpoints = await prisma.checkpoint.findMany()

  res.send(allCheckpoints)
})

checkpointsRouter.post("/", async (req: Request, res: Response) => {
  const allCheckpoints = await prisma.checkpoint.findMany()

  if (allCheckpoints.length >= 8) {
    res.status(400).json({ error: "Rastien maksimimäärä on 8 rastia."})
    return
  }

  const body = req.body

  if (!body.name ) {
    res.status(400).json({ error: "Kaikkia vaadittuja tietoja ei ole annettu."})
    return
  }

  const inputName = body.name.trim()

  if  (inputName.length > 100 ) {
    res.status(400).json({ error: "Nimi on liian pitkä. Maksimi pituus on 100 kirjainta."})
    return
  }

  if (inputName.length < 2 ) {
    res.status(400).json({ error: "Nimi on liian lyhyt. Minimi pituus on 2 kirjainta."})
    return
  }

  const existingName = await prisma.checkpoint.findFirst({
    where: {
      name: {
        equals: inputName,
        mode: "insensitive"
      }
    }
  })
  if (existingName) {
    res.status(400).json({ error: "Rastin nimi on jo käytössä." })
    return
  }

  let parsedType: Type | undefined = undefined;

  if (body.type) {
    if (!Object.values(Type).includes(body.type)) {
      res.status(400).json({ error: "Virheellinen tyyppi." })
      return
    }

    parsedType = body.type as Type

    if (parsedType === Type.START) {
      const existingStart = await prisma.checkpoint.findFirst({
        where: { type: Type.START }
      })
      if (existingStart) {
        res.status(400).json({ error: "Lähtörasti on jo luotu." })
        return
      }
    } else if (parsedType === Type.FINISH) {
      const existingFinish = await prisma.checkpoint.findFirst({
        where: { type: Type.FINISH }
      })
      if (existingFinish) {
        res.status(400).json({ error: "Maali on jo luotu." })
        return
      }
    }
  }

  const savedCheckpoint = await prisma.checkpoint.create({
    data: {
      name: body.name,
      type: parsedType,
      hint: body.hint,
      event_id: body.event_id
    }
  })
  res.status(201).json(savedCheckpoint)
})

checkpointsRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  await prisma.checkpoint.delete({
    where: {
      id: Number(id),
    },
  })
  res.status(204).end()
})

export default checkpointsRouter
