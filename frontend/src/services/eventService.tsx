import axios from "axios"
import { url } from "../config"
<<<<<<< HEAD
import { AddEvent, Event } from "@/types"
=======
import { AddEvent } from "@/types"
>>>>>>> 5270bc3 (Fixes to event creation functionality)

export const getEvents = async () => {
  const response = await axios.get<Event[]>(`${url}/event`)
  return response.data
}

export const getEvent = async (id: number) => {
  const response = await axios.get<Event>(`${url}/event/${id}`)
  return response.data
}

export const startGame = async (id: number) => {
  const response = await axios.put<Event>(`${url}/event/start/${id}`)
  return response.data
}

export const endGame = async (id: number) => {
  const response = await axios.put<Event>(`${url}/event/end/${id}`)
  return response.data
}

export const createEvent = async (event: AddEvent) => {
  const response = await axios.post<AddEvent>(`${url}/event/create`, event)
  return response.data
}