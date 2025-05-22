import express, { Response, Request } from "express"
import { prisma } from "../src/index"
//import { Type } from "../prisma/prisma/"

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

export default groupsRouter
