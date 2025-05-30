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
    res.status(200).json(updatedEvent)
  }
})

//add one distance between two checkpoints
settingsRouter.post("/update_distance", async (req: Request, res: Response) => {
  const event_id = req.body.event_id
  const from_checkpoint_id = req.body.from_checkpoint_id
  const to_checkpoint_id = req.body.to_checkpoint_id
  const time = req.body.time

  const addedDistance = await prisma.checkpointDistance.create({
    data: {
      event_id: event_id,
      from_id: from_checkpoint_id,
      to_id: to_checkpoint_id,
      time: time
    }
  })

  res.send(addedDistance)
})

//get a single distance between two checkpoints
settingsRouter.get("/:event_id/distances/:from_id/:to_id", async (req: Request, res: Response) => {
  const event_id = Number(req.params.event_id)
  const from_id = Number(req.params.from_id)
  const to_id = Number(req.params.to_id)

  const result = await prisma.checkpointDistance.findFirst({
    where: {event_id: event_id, from_id: from_id, to_id: to_id}
  })

  if (result) {
    res.send(result.time) //example: 30
  } else {
    res.status(404).end()
  }

})

//get all distances from one checkpoint
settingsRouter.get("/:event_id/distances/:from_id", async (req: Request, res: Response) => {
  const event_id = Number(req.params.event_id)
  const from_id = Number(req.params.from_id)

  const result = await prisma.checkpointDistance.findMany({
    select: {to_id: true, time: true},
    where: {event_id: event_id, from_id: from_id}
  })

  const times: { [index: number]: number} = {}

  result.map(row => {
    times[row.to_id] = row.time
  })

  res.send(times) //examples: { "2": 30, "15": 11, ... } or {}
})

//get all distances in an event
settingsRouter.get("/:event_id/distances", async (req: Request, res: Response) => {
  const event_id = Number(req.params.event_id)

  const result = await prisma.checkpointDistance.findMany({
    select: {from_id: true, to_id: true, time: true},
    where: {event_id: event_id}
  })

  const times: { [from_id: number]: {[to_id: number]: number} } = {}

  result.map(row => {
    if (!(row.from_id in times))
      times[row.from_id] = {}
    times[row.from_id][row.to_id] = row.time
  })

  res.send(times) //examples { "1": { "2": 20, "3": 30, ... }, ... } or {}
})

//add or update distances
settingsRouter.put("/update_distances", async (req: Request, res: Response) => {
  /*
  An example req.body:

  {
    "event_id": 1,
    "distances": {
        "2": {"13": 12, "15": 30},
        "3": {"3": 23, "15": 24},
        "15": {"2": 1, "15": 13},
        "20": {},
        "29": {}
    }
  }

  */

  const distances = req.body
  const event_id = 1 //req.body.event_id

  let upserts = 0
  let failures = 0

  for (const [fromId] of Object.entries(distances)) {
    const from_id = Number(fromId)

    for (const [toId, time] of Object.entries(distances[fromId])) {
      const to_id = Number(toId)

      try {
        const upsertedData = await prisma.checkpointDistance.upsert({
          where: {
            from_id_to_id_event_id: {
              from_id: from_id,
              to_id: to_id,
              event_id: event_id
            }
          },
          create: {from_id: from_id, to_id: to_id, time: Number(time), event_id: event_id},
          update: {time: Number(time)},
        })

        console.log("upsertedData:", upsertedData)
        upserts += 1
      } catch {
        console.log("Error while trying to upsert", from_id, to_id, time, ":")
        failures += 1
      }
    }
  }

  res.status(200).json({upserts: upserts, failures: failures})
})

export default settingsRouter
