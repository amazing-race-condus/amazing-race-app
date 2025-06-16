import axiosInstance from "./api"
import { AddGroup, Group } from "@/types"

export const getAllGroups = async (eventId: number): Promise<Group[]> => {
  const response = await axiosInstance.get<Group[]>("/groups",{
    params: {
      eventId: eventId
    }
  }
  )
  return response.data
}

export const getArrivingGroups = async (checkpointId: number): Promise<Group[]> => {
  const response = await axiosInstance.get<Group[]>(`/groups/by_next_checkpoint/${checkpointId}`)
  return response.data
}

export const createGroup = async (newGroup: AddGroup, eventId: number) => {
  const response = await axiosInstance.post<Group>("/groups",{
    ...newGroup,
    eventId: eventId
  })
  return response.data
}

export const removeGroup = async (id: number) => {
  const response = await axiosInstance.delete(`/groups/${id}`)
  return response.data
}

export const giveNextCheckpoint = async (id: number, checkpointId: number) => {
  const response = await axiosInstance.put<Group>(`/groups/next_checkpoint/${id}`, {nextCheckpointId: checkpointId})
  return response.data
}

export const dnfGroup = async (id: number) => {
  const response = await axiosInstance.put(`/groups/${id}/dnf`)
  return response.data
}

export const disqualifyGroup = async (id: number) => {
  const response = await axiosInstance.put(`/groups/${id}/disqualify`)
  return response.data
}

export const editGroup = async (id: number, newObject: AddGroup) => {
  const response = await axiosInstance.put(`/groups/${id}`, newObject)
  return response.data
}
