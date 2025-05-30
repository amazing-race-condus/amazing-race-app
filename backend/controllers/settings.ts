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
  const eventId = Number(req.params.eventId)

  const event = await prisma.event.findUnique({ select: { maxRouteTime : true, minRouteTime: true }, where: {id: eventId }})
  console.log(event)
  res.send(event)
})

settingsRouter.get("/:event_id/min", async (req: Request, res: Response) => {
  const eventId = Number(req.params.eventId)

  const event = await prisma.event.findUnique({ select: { minRouteTime: true }, where: {id: eventId }})

  res.send(event)
})

settingsRouter.get("/:event_id/max", async (req: Request, res: Response) => {
  const eventId = Number(req.params.eventId)

  const event = await prisma.event.findUnique({ select: { maxRouteTime: true }, where: {id: eventId }})

  res.send(event)
})

settingsRouter.put("/update_limits", async (req: Request, res: Response) => {
  const eventId = req.body.id
  const newMinRouteTime = req.body.minRouteTime
  const newMaxRouteTime = req.body.maxRouteTime

  if (!validateMinAndMax(newMinRouteTime, newMaxRouteTime, res)) {
    return
  } else {
    const updatedEvent = await prisma.event.update({
      where: {id: eventId},
      data: {minRouteTime: newMinRouteTime, maxRouteTime: newMaxRouteTime}
    })
    res.status(200).json(updatedEvent)
  }
})

//add one distance between two checkpoints
settingsRouter.post("/update_distance", async (req: Request, res: Response) => {
  const eventId = req.body.eventId
  const from_checkpoint_id = req.body.from_checkpoint_id
  const to_checkpoint_id = req.body.to_checkpoint_id
  const time = req.body.time

  const addedDistance = await prisma.checkpointDistance.create({
    data: {
      eventId: eventId,
      fromId: from_checkpoint_id,
      toId: to_checkpoint_id,
      time: time
    }
  })

  res.send(addedDistance)
})

//get a single distance between two checkpoints
settingsRouter.get("/:event_id/distances/:fromId/:toId", async (req: Request, res: Response) => {
  const eventId = Number(req.params.eventId)
  const fromId = Number(req.params.fromId)
  const toId = Number(req.params.toId)

  const result = await prisma.checkpointDistance.findFirst({
    where: {eventId: eventId, fromId: fromId, toId: toId}
  })

  if (result) {
    res.send(result.time) //example: 30
  } else {
    res.status(404).end()
  }

})

//get all distances from one checkpoint
settingsRouter.get("/:event_id/distances/:fromId", async (req: Request, res: Response) => {
  const eventId = Number(req.params.eventId)
  const fromId = Number(req.params.fromId)

  const result = await prisma.checkpointDistance.findMany({
    select: {toId: true, time: true},
    where: {eventId: eventId, fromId: fromId}
  })

  const times: { [index: number]: number} = {}

  result.map(row => {
    times[row.toId] = row.time
  })

  res.send(times) //examples: { "2": 30, "15": 11, ... } or {}
})

//get all distances in an event
settingsRouter.get("/:event_id/distances", async (req: Request, res: Response) => {
  const eventId = Number(req.params.eventId)

  const result = await prisma.checkpointDistance.findMany({
    select: {fromId: true, toId: true, time: true},
    where: {eventId: eventId}
  })

  const times: { [fromId: number]: {[toId: number]: number} } = {}

  result.map(row => {
    if (!(row.fromId in times))
      times[row.fromId] = {}
    times[row.fromId][row.toId] = row.time
  })

  res.send(times) //examples { "1": { "2": 20, "3": 30, ... }, ... } or {}
})

//add or update distances
settingsRouter.put("/update_distances", async (req: Request, res: Response) => {
  /*
  An example req.body:

  {
    "eventId": 1,
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
  const eventId = 1 //req.body.eventId

  let upserts = 0
  let failures = 0

  for (const [newFromId] of Object.entries(distances)) {
    const fromId = Number(newFromId)

    for (const [newToId, time] of Object.entries(distances[fromId])) {
      const toId = Number(newToId)

      try {
        const upsertedData = await prisma.checkpointDistance.upsert({
          where: {
            fromId_toId_eventId: {
              fromId: fromId,
              toId: toId,
              eventId: eventId
            }
          },
          create: {fromId: fromId, toId: toId, time: Number(time), eventId: eventId},
          update: {time: Number(time)},
        })

        console.log("upsertedData:", upsertedData)
        upserts += 1
      } catch {
        console.log("Error while trying to upsert", fromId, toId, time, ":")
        failures += 1
      }
    }
  }

  res.status(200).json({upserts: upserts, failures: failures})
})

export default settingsRouter
