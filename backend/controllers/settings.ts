import express, { Response, Request } from "express"
import { prisma } from "../src/index"
const settingsRouter = express.Router()

<<<<<<< HEAD
const validateMinAndMax = (min : number, max : number) : boolean => {
  if (!(Number.isInteger(min) && Number.isInteger(max)))
    return false

  if (min > max || max < min)
    return false

  return true
}

=======
//get min and max
>>>>>>> 835baa3 (Add database functions)
settingsRouter.get("/:event_id/limits", async (req: Request, res: Response) => {
  const event_id = Number(req.params.event_id)

  const event = await prisma.event.findUnique({ select: { max_route_time : true, min_route_time: true }, where: {id: event_id }})

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

<<<<<<< HEAD
settingsRouter.post("/update_limits", async (req: Request, res: Response) => {
  const event_id = req.body.id
  const new_min_route_time = req.body.min_route_time
  const new_max_route_time = req.body.max_route_time

  if (!validateMinAndMax(new_min_route_time, new_max_route_time)) {
    res.status(400).json({"error": "Invalid input"})
  } else {
    const updatedEvent = await prisma.event.update({
      where: {id: event_id},
      data: {min_route_time: new_min_route_time, max_route_time: new_max_route_time}
    })
    res.send(updatedEvent)
  }
=======
//update min
settingsRouter.post("/update_min", async (req: Request, res: Response) => {
  const event_id = req.body.id
  const new_min_route_time = req.body.min_route_time

  const updatedEvent = await prisma.event.update({
    where: {id: event_id},
    data: {min_route_time: new_min_route_time}
  })

  res.send(updatedEvent)
})

//update max. TODO: change to update both
settingsRouter.post("/update_max", async (req: Request, res: Response) => {
  const event_id = req.body.id
  const new_max_route_time = req.body.max_route_time

  const updatedEvent = await prisma.event.update({
    where: {id: event_id},
    data: {max_route_time: new_max_route_time}
  })

  res.send(updatedEvent)
>>>>>>> 835baa3 (Add database functions)
})

export default settingsRouter
