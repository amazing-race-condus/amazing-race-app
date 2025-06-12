import axios from "axios"
import { url } from "../config"
import { Event } from "@/types"

export const getEvents = async () => {
  const request = axios.get<Event[]>(`${url}/event`)
  const response = await request
  return response.data
}

export const getEvent = async (id : number) => {
  const request = axios.get<Event>(`${url}/event/${id}`)
  const response = await request
  return response.data
}

export const startGame = async (id : number) => {
  const request = axios.put<Event>(`${url}/event/start/${id}`)
  const response = await request
  return response.data
}

export const endGame = async (id : number) => {
  const request = axios.put<Event>(`${url}/event/end/${id}`)
  const response = await request
  return response.data
}