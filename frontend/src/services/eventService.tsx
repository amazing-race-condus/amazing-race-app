import axios from "axios"
import { url } from "../config"
import { AddEvent, Event } from "@/types"

export const getEvents = async () => {
  const response = await axios.get<Event[]>(`${url}/event`)
  return response.data
}

export const getEvent = async (id: number) => {
  const response = await axios.get<Event>(`${url}/event/${id}`)
  return response.data
}

export const getDefaultEvent = async () => {
  const request = axios.get<Event>(`${url}/event/default`)
  const response = await request
  return response.data
}

export const startGame = async (id : number) => {
  const request = axios.put<Event>(`${url}/event/start/${id}`)
  const response = await request
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