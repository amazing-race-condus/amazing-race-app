import { prisma } from "../index"
import { getValidRoutes } from "../services/routes"
import { validateMinAndMax, validateCheckpointDistances } from "../utils/routeValidators"
import { Distances, Route, RouteStep } from "@/types"

interface Routes {
  id: number,
  routeTime: number,
  routeSteps: RouteStep[]
}

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
        await prisma.checkpointDistance.upsert({
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

        upserts += 1
      } catch {
        failures += 1
      }
    }
  }
  return {upserts: upserts, failures: failures}
}

const resetRoutes = async (eventId: number) => {
  await prisma.route.deleteMany({
    where: {
      eventId : eventId
    }
  })
  await prisma.penalty.deleteMany({
    where: {
      eventId : eventId
    }
  })
  await prisma.group.updateMany({
    where: {
      eventId : eventId
    },
    data: {
      finishTime: null,
      nextCheckpointId: null,
      disqualified: false,
      dnf: false
    }
  })
}

const updateRoutes = async (routes: Route[], eventId : number) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const operations: any[] = []

  for (const route of routes) {
    // Create the route and get a reference to its future ID
    const createRoute = prisma.route.create({
      data: {
        routeTime: route.length,
        eventId: eventId
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

// Sorts routes in order of distance to mean of min and max route time.
const sortRoutes = (routes: Routes[], mean: number) => {
  const compare = (a: Routes, b: Routes) => {
    if (Math.abs(a.routeTime - mean) < Math.abs(b.routeTime - mean)) {
      return -1
    } else if (Math.abs(a.routeTime - mean) > Math.abs(b.routeTime - mean)) {
      return 1
    }
    return 0
  }
  const sortedRoutes = routes.toSorted(compare)
  return sortedRoutes
}

const assignRoutesToGroups = async (mean: number, eventId: number) => {
  const unsortedRoutes = await prisma.route.findMany({
    where : {
      eventId : eventId
    },
    select: {
      id: true,
      routeTime: true,
      routeSteps: {
        orderBy: {
          checkpointOrder: "asc"
        }
      }
    }
  })
  const routes = sortRoutes(unsortedRoutes, mean)
  const groups = await prisma.group.findMany({
    where : {
      eventId : eventId
    },
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
    const checkpoints = await prisma.checkpoint.findMany({
      where: {
        eventId: eventId
      }
    })
    const hasStart = checkpoints.some(cp => cp.type === "START")
    const hasFinish = checkpoints.some(cp => cp.type === "FINISH")
    const distances = await getDistances(eventId)
    const event = await prisma.event.findUnique({where: {id: eventId }})
    if (!event) {
      response.message = "Tapahtumaa ei löytynyt annetulla ID:llä"
      return response
    }

    const min = event.minRouteTime
    const max = event.maxRouteTime
    let errorMessage = ""

    if (!min || !max) {
      errorMessage = "Minimi- ja maksimiaikoja ei ole määritelty"
    } else if (event.startTime && !event.endTime) {
      errorMessage = "Reittejä ei voitu luoda. Peli on jo käynnissä"
    } else if (!hasStart || !hasFinish) {
      errorMessage = "Lähtöä tai maalia ei ole määritelty"
    } else if (!(validateCheckpointDistances(distances, checkpoints))) {
      errorMessage = "Kaikkien rastien välille ei ole määritelty matka-aikoja"
    }
    if (errorMessage) {
      response.message = errorMessage
      return response
    }

    const routes = getValidRoutes(checkpoints, distances, min, max)

    if (routes.length === 0) {
      response.message = "Reittejä ei voitu luoda asettamillasi minimi- ja maksimiajoilla"
      return response
    }

    await resetRoutes(eventId)
    await updateRoutes(routes, eventId)
    const numberOfGroups = await assignRoutesToGroups((max!+min!)/2, eventId)

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

export const getRoutesInfo = async (eventId: number) => {
  const routes = await prisma.route.findMany({
    where: {
      eventId: eventId
    },
    select: {
      id: true,
      routeTime: true
    },
    orderBy: {
      routeTime: "asc"
    }
  })

  return routes
}

export const getActiveRoutesInfo = async (eventId: number) => {
  const activeRoutes = await prisma.route.findMany({
    where: {
      eventId: eventId,
      group: {
        some: {}
      }
    },
    select: {
      id: true,
      routeTime: true
    },
    orderBy: {
      routeTime: "asc"
    }
  })

  return activeRoutes
}
