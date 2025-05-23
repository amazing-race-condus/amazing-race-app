import express, { Response, Request } from "express"
import { prisma } from "../src/index"
const settingsRouter = express.Router()

const validateMinAndMax = (min: number, max: number, res: Response) : boolean => {
  if (!(Number.isInteger(min) && Number.isInteger(max))) {
    res.status(400).json({"error": "Syöte on oltava kokonaisluku."})
    return false
  }

  if (min >= max) {
    res.status(400).json({"error": "Maksimiaika on oltava suurempi kuin minimiaika."})
    return false
  }

  if (min < 0 || max < 0) {
    res.status(400).json({"error": "Ajat eivät voi olla negatiivisia."})
    return false
  }
  return true
}

settingsRouter.get("/:event_id/limits", async (req: Request, res: Response) => {
  const event_id = Number(req.params.event_id)

  const event = await prisma.event.findUnique({ select: { max_route_time : true, min_route_time: true }, where: {id: event_id }})
  console.log(event)
  res.send(event)
})

settingsRouter.get("/:event_id/min", async (req: Request, res: Response) => {
  const event_id = Number(req.params.event_id)

  const event = await prisma.event.findUnique({ select: { min_route_time: true }, where: {id: event_id }})

  res.send(event)
})

settingsRouter.get("/:event_id/max", async (req: Request, res: Response) => {
  const event_id = Number(req.params.event_id)

  const event = await prisma.event.findUnique({ select: { max_route_time: true }, where: {id: event_id }})

  res.send(event)
})

settingsRouter.put("/update_limits", async (req: Request, res: Response) => {
  const event_id = req.body.id
  const new_min_route_time = req.body.min_route_time
  const new_max_route_time = req.body.max_route_time

  if (!validateMinAndMax(new_min_route_time, new_max_route_time, res)) {
    return
  } else {
    const updatedEvent = await prisma.event.update({
      where: {id: event_id},
      data: {min_route_time: new_min_route_time, max_route_time: new_max_route_time}
    })
    res.send(updatedEvent)
  }
})

export default settingsRouter
