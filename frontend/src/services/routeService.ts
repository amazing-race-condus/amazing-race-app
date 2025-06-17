import axiosInstance from "./api"
import { RouteLimit, Distances } from "@/types"

export const getLimits = async (eventId: number) => {
  const response = await axiosInstance.get(`/settings/${eventId}/limits`)
  return response.data
}

export const setLimits = async (limit: RouteLimit) => {
  const response = await axiosInstance.put<RouteLimit>("/settings/update_limits", limit)
  return response.data
}

export const getDistances = async (eventId: number) => {
  const response = await axiosInstance.get(`/settings/${eventId}/distances`)
  return response.data
}

export const setDistances = async (distances: Distances, eventId: number) => {
  const response = await axiosInstance.put<Distances>(`/settings/${eventId}/update_distances`, distances)
  return response.data
}

export const generateRoutes = async (eventId: number) => {
  const response = await axiosInstance.put(`/settings/${eventId}/create_routes`)
  return response.data
}

export const getRoutesInfo = async (eventId: number) => {
  const response = await axiosInstance.get(`/settings/${eventId}/routes_info`)
  return response.data
}

export const getActiveRoutesInfo = async (eventId: number) => {
  const response = await axiosInstance.get(`/settings/${eventId}/active_routes_info`)
  return response.data
}