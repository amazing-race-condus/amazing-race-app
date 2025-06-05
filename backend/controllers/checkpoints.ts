import express, { Response, Request } from "express"
import { prisma } from "../src/index"
import { Type } from "../prisma/prisma/"
import { validateName, validateCheckpointLayout } from "../utils/checkpointVaildators"

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

  const body = req.body

  if (!body.name || !body.type) {
    res.status(400).json({ error: "Kaikkia vaadittuja tietoja ei ole annettu."})
    return
  }

  const validName = await validateName(body.name, res)
  if (!validName) {
    return
  }

  let parsedType: Type | undefined = undefined;


  if (!Object.values(Type).includes(body.type)) {
    res.status(400).json({ error: "Virheellinen tyyppi." })
    return
  }

  parsedType = body.type as Type

  const validCheckpointLayout = await validateCheckpointLayout(parsedType, res)
  if (!validCheckpointLayout) {
    return
  }

  const savedCheckpoint = await prisma.checkpoint.create({
    data: {
      name: body.name,
      type: body.type,
      hint: body.hint,
      eventId: body.eventId
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
