import express, { Response } from "express"
import { prisma } from "../src/index"

//import { Type } from "../prisma/prisma/"

const eventRouter = express.Router()

eventRouter.get("/", async (_, res: Response) => {
  console.log("Fetching all events")

  const events = await prisma.event.findMany({
    include: {
      group: true,
      checkpoints: true,
    }
  })

  res.json(events)
  return
})

eventRouter.get("/:id", async (_, res: Response) => {
  const id = Number(_.params.id)

  console.log("Fetching event with ID:", id)

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      group: true,
      checkpoints: true,
    }
  })

  if (event) {
    res.json(event)
  } else {
    res.status(404).end()
  }
  return
})


eventRouter.put("/start/:id", async (_, res: Response) => {
  const id = Number(_.params.id)

  const now = new Date()
  // To do right way to add timezone
  const plus3h = new Date(now.getTime() + 3 * 60 * 60 * 1000)

  const event = await prisma.event.update({
    where: { id },
    data: {
      startTime: plus3h,
      endTime: null
    }
  })

  if (event) {
    res.json(event)
  } else {
    res.status(404).json({ error: "Ryhmää ei löydy" })
  }
  return
})

eventRouter.put("/end/:id", async (_, res: Response) => {
  const id = Number(_.params.id)

  const now = new Date()
  // To do right way to add timezone
  const plus3h = new Date(now.getTime() + 3 * 60 * 60 * 1000)

  const event = await prisma.event.update({
    where: { id },
    data: { endTime : plus3h }
  })

  if (event) {
    res.json(event)
  } else {
    res.status(404).json({ error: "Ryhmää ei löydy" })
  }
  return
})

export default eventRouter
