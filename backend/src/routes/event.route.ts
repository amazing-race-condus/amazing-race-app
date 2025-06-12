import express, { Response, Request } from "express"
import { getAllEvents, getEventById, startEvent,
  endEvent, createEvent } from "../controllers/event.controller"

const eventRouter = express.Router()

eventRouter.get("/", async (_, res: Response) => {
  const events = await getAllEvents()
  res.json(events)
  return
})

eventRouter.get("/:id", async (_, res: Response) => {
  const id = Number(_.params.id)

  const event = await getEventById(id)
  if (event) {
    res.json(event)
  } else {
    res.status(404).end()
  }
  return
})

eventRouter.put("/start/:id", async (_, res: Response) => {
  const id = Number(_.params.id)

  const event = await startEvent(id)

  if (event) {
    res.json(event)
  } else {
    res.status(404).json({ error: "Tapahtumaa ei voitu aloittaa." })
  }
  return
})

eventRouter.put("/end/:id", async (_, res: Response) => {
  const id = Number(_.params.id)

  const event = await endEvent(id)

  if (event) {
    res.json(event)
  } else {
    res.status(404).json({ error: "Tapahtumaa ei voitu päättää. Onko tapahtuma aloitettu?" })
  }
  return
})

eventRouter.post("/create", async (req: Request, res: Response) => {
  const event = await createEvent(req.body)

  if (event) {
    res.json(event)
  } else {
    res.status(400).json({ error: "Tapahtumaa ei voitu luoda."})
  }
  return
})

export default eventRouter
