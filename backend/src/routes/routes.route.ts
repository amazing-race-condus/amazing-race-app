import express, { Response, Request } from "express"
import { getLimits, updateLimits, getDistances, updateDistances,
  createRoutes,
  getRoutesInfo,
  getActiveRoutesInfo,
  validDistances
} from "../controllers/routes.controller"
import { verifyToken } from "../utils/middleware"
import { getEventById } from "../controllers/event.controller"
import { User } from "@/types"

const routesRouter = express.Router()

interface CustomRequest extends Request {
  user?: User
}

routesRouter.get("/:event_id/limits", verifyToken, async (req: Request, res: Response) => {
  const eventId = Number(req.params.event_id)
  const event = await getLimits(eventId)
  res.send(event)
})

routesRouter.put("/update_limits", verifyToken, async (req: CustomRequest, res: Response) => {
  const user = req.user
  if (!user || user.admin !== true) {
    res.status(401).json({ error:"Tämä toiminto on sallittu vain pääkäyttäjälle"})
    return
  }
  const eventId = req.body.id
  const newMinRouteTime = req.body.minRouteTime
  const newMaxRouteTime = req.body.maxRouteTime

  const response = await updateLimits(eventId, newMinRouteTime, newMaxRouteTime)
  if (response.status === "error") {
    res.status(400).json({error: response.message})
  } else {
    req.app.get("io").emit("event:limits_updated", { eventId, newMinRouteTime, newMaxRouteTime })
    res.status(200).json(response)
  }
})

routesRouter.get("/:event_id/distances", verifyToken, async (req: Request, res: Response) => {
  const eventId = Number(req.params.event_id)
  const times = await getDistances(eventId)
  res.send(times)
})

routesRouter.get("/:event_id/distances/validate", verifyToken, async (req: Request, res: Response) => {
  const eventId = Number(req.params.event_id)
  const valid = await validDistances(eventId)
  res.send(valid)
})

routesRouter.get("/:event_id/active_routes_info", verifyToken, async (req: Request, res: Response) => {
  const eventId = Number(req.params.event_id)

  const activeRoutes = await getActiveRoutesInfo(eventId)

  res.send(activeRoutes)
})

routesRouter.get("/:event_id/routes_info", verifyToken, async (req: Request, res: Response) => {
  const eventId = Number(req.params.event_id)

  const routes = await getRoutesInfo(eventId)

  res.send(routes)
})

routesRouter.put("/:event_id/update_distances", verifyToken, async (req: CustomRequest, res: Response) => {
  const user = req.user
  if (!user || user.admin !== true) {
    res.status(401).json({ error:"Tämä toiminto on sallittu vain pääkäyttäjälle"})
    return
  }
  const distances = req.body
  const eventId = Number(req.params.event_id)
  const result = await updateDistances(eventId, distances)
  res.status(200).json(result)
})

routesRouter.put("/:event_id/create_routes", verifyToken, async (req: CustomRequest, res: Response) => {
  const user = req.user
  if (!user || user.admin !== true) {
    res.status(401).json({ error:"Tämä toiminto on sallittu vain pääkäyttäjälle"})
    return
  }
  const eventId = Number(req.params.event_id)
  const event = await getEventById(eventId)
  if (event?.startTime) {
    res.status(403).json({ error: "Reittejä ei voi luoda jos tapahtuma on aloitettu" })
  }
  const response = await createRoutes(eventId)
  if (response.status === "error") {
    res.status(400).json({error: response.message})
  } else {
    req.app.get("io").emit("groups:routes_generated")
    res.status(200).json({routesAmount: response.values.routeAmount,
      groupsAmount: response.values.groupAmount})
  }
})

export default routesRouter
