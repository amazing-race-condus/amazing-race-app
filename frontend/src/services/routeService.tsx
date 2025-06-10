import axios from "axios"
import { RouteLimit, Distances } from "@/types"
import { url } from "../config"

export const getLimits = async (eventId: number) => {
  const response = await axios.get(`${url}/settings/${eventId}/limits`)
  return response.data
}

export const setLimits = async (limit: RouteLimit) => {
  const response = await axios.put<RouteLimit>(`${url}/settings/update_limits`, limit)
  return response.data
}

export const getDistances = async (eventId: number) => {
  const response = await axios.get(`${url}/settings/${eventId}/distances`)
  return response.data
}

export const setDistances = async (distances: Distances) => {
  const response = await axios.put<Distances>(`${url}/settings/update_distances`, distances)
  return response.data
}

export const generateRoutes = async () => {
  const response = await axios.put(`${url}/settings/create_routes`)
  return response.data
}
