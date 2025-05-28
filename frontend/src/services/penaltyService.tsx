import axios from "axios"
import { Platform } from "react-native"
import type { Penalty } from "@/types"

const url =
  Platform.OS === "web"
    ? process.env.EXPO_PUBLIC_WEB_BACKEND_URL
    : process.env.EXPO_PUBLIC_BACKEND_URL

export const getPenalty = async (id: number | string[]) => {
  const response = await axios
    .get<JSON[]>(`${url}/penalty/${id}`)
  return response.data
}

export const givePenalty = async (id: number | string[], penaltytime: number) => {
  const response = await axios
    .post<Penalty>(`${url}/penalty/${id}`, { penalty_time: penaltytime })
  return response.data
}

export const removePenalty = async (id: number | string[]) => {
  const response = await axios
    .delete(`${url}/penalty/${id}`)
  return response.data
}

