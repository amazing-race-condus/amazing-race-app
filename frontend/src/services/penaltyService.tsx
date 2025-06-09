import axios from "axios"
import { url } from "../config"
import type { Penalty, PenaltyType } from "@/types"

export const getPenalty = async (groupId: number) => {
  const response = await axios
    .get<JSON[]>(`${url}/penalty/${groupId}`)
  return response.data
}

export const givePenalty = async (groupId: number, checkpointId: number, penaltyType: PenaltyType, penaltyTime: number) => {
  const response = await axios
    .post<Penalty>(`${url}/penalty/${groupId}`, { checkpointId: checkpointId, type: penaltyType, time: penaltyTime })
  return response.data
}

export const removePenalty = async (PenaltyId: number) => {
  const response = await axios
    .delete(`${url}/penalty/${PenaltyId}`)
  return response.data
}

