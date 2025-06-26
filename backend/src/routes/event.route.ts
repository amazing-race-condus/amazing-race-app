import express, { Response, Request } from "express"
import { getAllEvents, getEventById, startEvent,
  endEvent,getDefaultEvent, createEvent, modifyEvent, deleteEvent } from "../controllers/event.controller"
import { verifyToken } from "../utils/middleware"
import { User } from "@/types"

const eventRouter = express.Router()

interface CustomRequest extends Request {
  user?: User
}


eventRouter.get("/", verifyToken, async (_, res: Response) => {
  const events = await getAllEvents()
  res.json(events)
  return
})

eventRouter.get("/default", verifyToken, async (_, res: Response) => {
  const event = await getDefaultEvent()
  res.json(event)
  return
})

eventRouter.get("/:id", verifyToken, async (_, res: Response) => {
  const id = Number(_.params.id)

  const event = await getEventById(id)
  if (event) {
    res.json(event)
  } else {
    res.status(404).end()
  }
  return
})

eventRouter.put("/start/:id", verifyToken, async (req: CustomRequest, res: Response) => {
  const user = req.user
  if (!user || user.admin !== true) {
    res.status(401).json({ error:"Tämä toiminto on sallittu vain pääkäyttäjälle"})
    return
  }
  const id = Number(req.params.id)

  const event = await startEvent(id)

  if (event) {
    req.app.get("io").emit("event:updated", event)
    res.json(event)
  } else {
    res.status(404).json({ error: "Tapahtumaa ei voitu aloittaa" })
  }
  return
})

eventRouter.put("/end/:id", verifyToken, async (req: CustomRequest, res: Response) => {
  const user = req.user
  if (!user || user.admin !== true) {
    res.status(401).json({ error:"Tämä toiminto on sallittu vain pääkäyttäjälle"})
    return
  }
  const id = Number(req.params.id)

  const event = await endEvent(id)

  if (event) {
    req.app.get("io").emit("event:updated", event)
    res.json(event)
  } else {
    res.status(404).json({ error: "Tapahtumaa ei voitu päättää. Onko tapahtuma aloitettu?" })
  }
  return
})

eventRouter.post("/create", verifyToken, async (req: CustomRequest, res: Response) => {
  const user = req.user
  if (!user || user.admin !== true) {
    res.status(401).json({ error:"Tämä toiminto on sallittu vain pääkäyttäjälle"})
    return
  }
  const event = await createEvent(req.body, res)

  if (event) {
    req.app.get("io").emit("event:created", event)
    res.json(event)
  } else {
    res.status(400).json({ error: "Tapahtumaa ei voitu luoda"})
  }
  return
})

eventRouter.put("/:id", verifyToken, async (req: CustomRequest, res: Response) => {

  const user = req.user
  if (!user || user.admin !== true) {
    res.status(401).json({ error:"Tämä toiminto on sallittu vain pääkäyttäjälle"})
    return
  }
  const id = Number(req.params.id)
  const { name, eventDate } = req.body
  const updatedEvent = await modifyEvent(id, name, eventDate, res)

  if (updatedEvent) {
    req.app.get("io").emit("event:updated", updatedEvent)
  }

  res.status(200).json(updatedEvent)

})

eventRouter.delete("/:id", verifyToken, async (req: CustomRequest, res: Response) => {
  const user = req.user
  if (!user || user.admin !== true) {
    res.status(401).json({ error:"Tämä toiminto on sallittu vain pääkäyttäjälle"})
    return
  }
  const id = Number(req.params.id)

  const event  = await deleteEvent(id)
  if (event) {
    req.app.get("io").emit("event:deleted", event)
    res.status(204).json(event)
  } else {
    res.status(404).end()
  }
})

export default eventRouter
