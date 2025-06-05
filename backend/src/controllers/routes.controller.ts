import { prisma } from "../index"
import { getValidRoutes } from "../routes"
import { Distances, Checkpoint, Route } from "@/types"

export const getLimits = async (eventId: number) => {
  const event = await prisma.event.findUnique(
    { select: { maxRouteTime : true, minRouteTime: true }, where: {id: eventId }})
  return event
}

export const updateLimits = async (eventId: number, min: number, max: number) => {
  const response = {status: "error", message:""}
  const errorMessage = validateMinAndMax(min, max)
  if (errorMessage) {
    response.message = errorMessage
    return response
  } else {
    try {
      await prisma.event.update({
        where: {id: eventId},
        data: {minRouteTime: min, maxRouteTime: max}
      })
      response.status = "success"
      return response
    } catch {
      response.message = "Järjestelmävirhe. Yritä myöhemmin uudelleen."
      return response
    }
  }
}

export const getDistances = async (eventId: number) => {
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

export const updateDistances = async (eventId: number, distances: Distances) => {
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
  return {upserts: upserts, failures: failures}
}

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
    })

    // Push the route creation to the operations array
    operations.push(createRoute)
  }

  // Execute all route creations first to get their IDs
  const createdRoutes = await prisma.$transaction(operations)

  // Now prepare all routeCheckpoint inserts

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checkpointOperations: any[] = []

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i]
    const routeId = createdRoutes[i].id

    const checkpointsData = route.route.map((checkpointId, order) => ({
      routeId,
      checkpointId,
      checkpointOrder: order
    }))

    checkpointOperations.push(
      prisma.routeCheckpoint.createMany({
        data: checkpointsData
      })
    )
  }

  // Insert all checkpoints in one transaction
  await prisma.$transaction(checkpointOperations)
}

const assignRoutesToGroups = async () => {
  const routes = await prisma.route.findMany({
    select: {
      id: true,
      routeSteps: {
        orderBy: {
          checkpointOrder: "asc"
        }
      }
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
    const nextCheckpointId = routes[routeIndex].routeSteps[0].checkpointId

    await prisma.group.update({
      where: { id: groupId },
      data: { routeId: routeId, nextCheckpointId: nextCheckpointId }
    })
  }
  return groupIds.length
}

export const createRoutes = async (eventId: number) => {
  const response = {status: "error", message: "", values: {routeAmount: 0, groupAmount: 0}}
  try {
    const checkpoints = await prisma.checkpoint.findMany()
    const hasStart = checkpoints.some(cp => cp.type === "START");
    const hasFinish = checkpoints.some(cp => cp.type === "FINISH");

    const distances = await getDistances(eventId)
    const limits = await prisma.event.findUnique({ select: { maxRouteTime : true, minRouteTime: true }, where: {id: eventId }})

    if (!limits) {
      response.message = "Tapahtumaa ei löytynyt annetulla ID:llä."
      return response
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
      response.message = errorMessage
      return response
    }

    const routes = getValidRoutes(checkpoints, distances, min, max)

    if (routes.length === 0) {
      response.message = "Reittejä ei voitu luoda asettamillasi minimi- ja maksimiajoilla."
      return response
    }

    await resetRoutes()
    await updateRoutes(routes)
    const numberOfGroups = await assignRoutesToGroups()

    response.status = "success"
    response.values.routeAmount = routes.length
    response.values.groupAmount = numberOfGroups
    return response
  } catch (error) {
    console.error("Unexpected error in /create_routes:", error)
    response.message =  "Järjestelmävirhe. Yritä myöhemmin uudelleen."
    return response
  }
}

const validateMinAndMax = (min: number, max: number): string => {
  if (!(Number.isInteger(min) && Number.isInteger(max))) {
    return "Syöte on oltava kokonaisluku."
  }

  if (min > max) {
    return "Minimiaika ei voi olla suurempi kuin maksimiaika."
  }

  if (min < 0 || max < 0) {
    return "Ajat eivät voi olla negatiivisia."
  }
  return ""
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
