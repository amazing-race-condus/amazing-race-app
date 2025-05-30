import express, { Response, Request } from "express"
import { prisma } from "../src/index"
import { getValidRoutes } from "../src/routes"
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

//get all distances in an event
settingsRouter.get("/:event_id/distances", async (req: Request, res: Response) => {
  const eventId = Number(req.params.event_id)

  const times = await getDistances(eventId)

  res.send(times) //examples { "1": { "2": 20, "3": 30, ... }, ... } or {}
})

const getDistances = async (eventId: number) => {
  const result = await prisma.checkpointDistance.findMany({
    select: {from_id: true, to_id: true, time: true},
    where: {event_id: eventId}
  })

  const times: { [from_id: number]: {[to_id: number]: number} } = {}

  result.map(row => {
    if (!(row.from_id in times))
      times[row.from_id] = {}
    times[row.from_id][row.to_id] = row.time
  })

  return times
}

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

settingsRouter.put("/create_routes", async (req: Request, res: Response) => {
  console.log("--- settingsRouter req.body:", req.body)

  const event_id = 1 //req.body.event_id
  console.log("create_routes, event_id:", event_id)

  //TODO: validate that all checkpoint distances are set for this event
  //if ()
  //  res.status(400).send({error: "Reittejä ei voi luoda, koska kaikkien rastien välille ei ole määritelty matka-aikoja."})

  //TODO: get all of these from database
  const checkpoints = [11, 22, 33, 44]
  const start = 10
  const end = 99
  const min = 0
  const max = 999999999999999

  //TODO
  //if (!(checkpoints.length === 4 && ...))
  //  res.send({error: "Reittejä ei voi luoda, koska tapahtumalle ei ole määritelty kaikkia tarvittavia tietoja: 4 rastia, 1 maali, 1 lähtö, reiti nminimikesto ja reitin maksimikesto)"})

  const distances = {
    10: {11: 999, 22: 999, 33: 999, 44: 999},
    11: {22: 999, 33: 999, 99: 999, 44: 999},
    22: {11: 999, 33: 999, 99: 999, 44: 999},
    33: {11: 999, 22: 999, 99: 999, 44: 999},
    44: {11: 999, 22: 999, 33: 999, 99: 999}
  } //TODO: get from database

  const routes = getValidRoutes(checkpoints, distances, min, max, start, end)
  //example: [ [ 11, 22, 33, 44 ], [ 11, 22, 44, 33 ], [ 33, 11, 22, 44 ] ]

  console.log("--- routes from getValidRoutes:", routes)

  if (routes.length === 0)
    res.status(400).send({"error": "Reittejä ei voitu luoda asettamillasi minimi- ja maksimiajoilla."})

  //TODO: save routes in database (and delete old routes and groups' routes)
  //...

  const route_ids = [101, 102, 103] //TODO: get routes from database
  const group_ids = [42, 55, 53, 63] //TODO: get groups from database. const groups = await prisma.group.findMany({ where: {event_id: event_id}}) 

  //save a route for every group in the database
  let group_i = 0
  for (group_i; group_i < group_ids.length; group_i ++) {
    const route_i = group_i % route_ids.length
    const group_id = group_ids[group_i]
    const route_id = route_ids[route_i]

    console.log("--- save route", route_id, "for group", group_id, "(TODO)")

    //tallennus tietokantaan

    //const updatedData = await prisma.group.update({
    //  where: { id: group_id, event_id: event_id},
    //  data: { route_id: route_id },
    //)

    //console.log("updatedData": updatedData)

  }

  res.status(200).json({routesAmount: routes.length})

const validateCheckpointDistances = async (): Promise<boolean> => {
  try {
    const eventId = 1
    const distances = await getDistances(eventId)
    const checkpoints = await prisma.checkpoint.findMany()

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
    return false
  }
}})


export default settingsRouter
