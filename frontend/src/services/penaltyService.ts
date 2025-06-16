import axiosInstance from "./api"
import type { Penalty, PenaltyType } from "@/types"

export const getPenalty = async (groupId: number) => {
  const response = await axiosInstance.get<JSON[]>(`/penalty/${groupId}`)
  return response.data
}

export const givePenalty = async (groupId: number, checkpointId: number, penaltyType: PenaltyType, penaltyTime: number) => {
  const response = await axiosInstance
    .post<Penalty>(`/penalty/${groupId}`, { checkpointId: checkpointId, type: penaltyType, time: penaltyTime })
  return response.data
}

export const removePenalty = async (PenaltyId: number) => {
  const response = await axiosInstance.delete(`/penalty/${PenaltyId}`)
  return response.data
}

