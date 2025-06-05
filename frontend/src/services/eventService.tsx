import axios from "axios"
import { Platform } from "react-native"
import { Event } from "@/types"

const url =
  Platform.OS === "web"
    ? process.env.EXPO_PUBLIC_WEB_BACKEND_URL
    : process.env.EXPO_PUBLIC_BACKEND_URL

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