import express, { Response, Request } from "express"
import { prisma } from "../src/index"
import { getValidRoutes } from "../src/routes"
import { Distances, Checkpoint, Route } from "@/types"

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

const validateCheckpointDistances = async (distances: Distances, checkpoints: Checkpoint[]): Promise<boolean> => {
  try {
    if (Object.keys(distances).length === 0) {
      return false
    }
    for (let i = 0; i < checkpoints.length; i++) {
      for (let j = 0; j < checkpoints.length; j++) {
        if (i !== j && checkpoints[i].type !== "FINISH" && checkpoints[j].type !== "START" && !(checkpoints[i].type === "START" && checkpoints[j].type === "FINISH")) {
          const fromId = checkpoints[i].id
          const toId = checkpoints[j].id
          if (!(Number.isInteger(distances[fromId][toId]))) {
            return false
          }
        }
      }
    }
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

const getDistances = async (eventId: number) => {
  const result = await prisma.checkpointDistance.findMany({
    select: {fromId: true, toId: true, time: true},
    where: {eventId: eventId}
  })
  const times: Distances = {}

  result.map(row => {
    if (!(row.fromId in times))
      times[row.fromId] = {}
    times[row.fromId][row.toId] = row.time
  })

  return times
}

settingsRouter.get("/:event_id/limits", async (req: Request, res: Response) => {
  const eventId = Number(req.params.event_id)
  const event = await prisma.event.findUnique({ select: { maxRouteTime : true, minRouteTime: true }, where: {id: eventId }})
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

//get all distances in an event
settingsRouter.get("/:event_id/distances", async (req: Request, res: Response) => {
  const eventId = Number(req.params.event_id)

  const times = await getDistances(eventId)

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

const resetRoutes = async () => {
  await prisma.route.deleteMany()
}

const updateRoutes = async (routes: Route[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const operations: any[] = [];

  for (const route of routes) {
    // Create the route and get a reference to its future ID
    const createRoute = prisma.route.create({
      data: {
        routeTime: route.length
      }
    });

    // Push the route creation to the operations array
    operations.push(createRoute);
  }

  // Execute all route creations first to get their IDs
  const createdRoutes = await prisma.$transaction(operations);

  // Now prepare all routeCheckpoint inserts

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checkpointOperations: any[] = [];

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const routeId = createdRoutes[i].id;

    const checkpointsData = route.route.map((checkpointId, order) => ({
      routeId,
      checkpointId,
      checkpointOrder: order
    }));

    checkpointOperations.push(
      prisma.routeCheckpoint.createMany({
        data: checkpointsData
      })
    );
  }

  // Insert all checkpoints in one transaction
  await prisma.$transaction(checkpointOperations);
};


const assignRoutesToGroups = async () => {
  const routes = await prisma.route.findMany({
    select: {
      id: true
    }
  })

  const groups = await prisma.group.findMany({
    select: {
      id: true
    }
  })

  const routeIds = routes.map(route => route.id)
  const groupIds = groups.map(group => group.id)

  for (let groupIndex = 0; groupIndex < groupIds.length; groupIndex ++) {
    const routeIndex = groupIndex % routes.length
    const groupId = groupIds[groupIndex]
    const routeId = routeIds[routeIndex]

    await prisma.group.update({
      where: { id: groupId },
      data: { routeId: routeId }
    })
  }}

settingsRouter.put("/create_routes", async (req: Request, res: Response) => {
  const eventId = 1 //req.body.event_id
  try {
    const checkpoints = await prisma.checkpoint.findMany()
    const hasStart = checkpoints.some(cp => cp.type === "START");
    const hasFinish = checkpoints.some(cp => cp.type === "FINISH");

    const distances = await getDistances(eventId)
    const limits = await prisma.event.findUnique({ select: { maxRouteTime : true, minRouteTime: true }, where: {id: eventId }})

    if (!limits) {
      res.status(404).json({ error: "Tapahtumaa ei löytynyt annetulla ID:llä." })
      return
    }

    const min = limits.minRouteTime
    const max = limits.maxRouteTime
    let errorMessage = ""

    if (!min || !max) {
      errorMessage = "Minimi- ja maksimiaikoja ei ole määritelty."
    } else if (!hasStart || !hasFinish) {
      errorMessage = "Lähtöä tai maalia ei ole määritelty."
    } else if (!(await validateCheckpointDistances(distances, checkpoints))) {
      errorMessage = "Kaikkien rastien välille ei ole määritelty matka-aikoja."
    }
    if (errorMessage) {
      res.status(400).json({error: errorMessage})
      return
    }

    const routes = getValidRoutes(checkpoints, distances, min, max)

    if (routes.length === 0) {
      res.status(400).json({error: "Reittejä ei voitu luoda asettamillasi minimi- ja maksimiajoilla."})
      return
    }
    console.log(`Number of routes: ${routes.length}`)

    await resetRoutes()
    await updateRoutes(routes)
    await assignRoutesToGroups()

    res.status(200).json({message: `${routes.length} reittiä luotu.`})
    return

  } catch (error) {
    console.error("Unexpected error in /create_routes:", error)
    res.status(500).json({ error: "Järjestelmävirhe. Yritä myöhemmin uudelleen." })
    return
  }
})

export default settingsRouter
