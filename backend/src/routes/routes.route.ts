import express, { Response, Request } from "express"
import { getLimits, updateLimits, getDistances, updateDistances,
  createRoutes,
  getRoutesInfo,
  getActiveRoutesInfo} from "../controllers/routes.controller"

const routesRouter = express.Router()

routesRouter.get("/:event_id/limits", async (req: Request, res: Response) => {
  const eventId = Number(req.params.event_id)
  const event = await getLimits(eventId)
  res.send(event)
})

routesRouter.put("/update_limits", async (req: Request, res: Response) => {
  const eventId = req.body.id
  const newMinRouteTime = req.body.minRouteTime
  const newMaxRouteTime = req.body.maxRouteTime

  const response = await updateLimits(eventId, newMinRouteTime, newMaxRouteTime)
  if (response.status === "error") {
    res.status(400).json({error: response.message})
  } else {
    res.status(200).json(response)
  }
})

routesRouter.get("/:event_id/distances", async (req: Request, res: Response) => {
  const eventId = Number(req.params.event_id)
  const times = await getDistances(eventId)
  res.send(times)
})

routesRouter.get("/:event_id/routes_info", async (req: Request, res: Response) => {
  const eventId = Number(req.params.event_id)

  const routes = await getRoutesInfo(eventId)

  res.send(routes)
})

routesRouter.get("/:event_id/active_routes_info", async (req: Request, res: Response) => {
  const eventId = Number(req.params.event_id)

  const activeRoutes = await getActiveRoutesInfo(eventId)

  res.send(activeRoutes)
})

routesRouter.put("/:event_id/update_distances", async (req: Request, res: Response) => {
  const distances = req.body
  const eventId = Number(req.params.event_id)
  const result = await updateDistances(eventId, distances)
  res.status(200).json(result)
})

routesRouter.put("/:event_id/create_routes", async (req: Request, res: Response) => {
  const eventId = Number(req.params.event_id)
  const response = await createRoutes(eventId)
  if (response.status === "error") {
    res.status(400).json({error: response.message})
  } else {
    res.status(200).json({routesAmount: response.values.routeAmount,
      groupsAmount: response.values.groupAmount})
  }
})

export default routesRouter
