import axiosInstance from "./api"
import { AddEvent, Event } from "@/types"

export const getEvents = async () => {
  const response = await axiosInstance.get<Event[]>("/event")
  return response.data
}

export const getEvent = async (id: number) => {
  const response = await axiosInstance.get<Event>(`/event/${id}`)
  return response.data
}

export const getDefaultEvent = async () => {
  const request = axiosInstance.get<Event>("/event/default")
  const response = await request
  return response.data
}

export const startGame = async (id : number) => {
  const request = axiosInstance.put<Event>(`/event/start/${id}`)
  const response = await request
  return response.data
}

export const endGame = async (id: number) => {
  const response = await axiosInstance.put<Event>(`/event/end/${id}`)
  return response.data
}

export const createEvent = async (event: AddEvent) => {
  const response = await axiosInstance.post<AddEvent>("/event/create", event)
  return response.data
}

export const editEvent = async (id: number, newObject: AddEvent) => {
  const response = await axiosInstance.put(`/event/${id}`, newObject)
  return response.data
}

export const removeEvent = async (id: number) => {
  const response = await axiosInstance.delete(`/event/${id}`)
  return response.data
}
