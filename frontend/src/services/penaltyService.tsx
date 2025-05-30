import axios from "axios"
import { Platform } from "react-native"
import type { Penalty, PenaltyType } from "@/types"

const url =
  Platform.OS === "web"
    ? process.env.EXPO_PUBLIC_WEB_BACKEND_URL
    : process.env.EXPO_PUBLIC_BACKEND_URL

export const getPenalty = async (groupId: number) => {
  const response = await axios
    .get<JSON[]>(`${url}/penalty/${groupId}`)
  return response.data
}

export const givePenalty = async (groupId: number, checkpointId: number, penaltyType: PenaltyType, penaltyTime: number) => {
  const response = await axios
    .post<Penalty>(`${url}/penalty/${groupId}`, { checkpointId: checkpointId, penaltyType: penaltyType, penaltyTime: penaltyTime })
  return response.data
}

export const removePenalty = async (PenaltyId: number) => {
  const response = await axios
    .delete(`${url}/penalty/${PenaltyId}`)
  return response.data
}

