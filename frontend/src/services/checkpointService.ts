import axiosInstance from "./api"
import { Checkpoint, AddCheckpoint } from "@/types"

export const getCheckpoint = async (id: string | string[]): Promise<Checkpoint> => {
  const response = await axiosInstance.get<Checkpoint>(`/checkpoints/${id}`)
  return response.data
}

export const getAllCheckpoints = async (eventId: number): Promise<Checkpoint[]> => {
  const response = await axiosInstance.get<Checkpoint[]>("/checkpoints", {
    params :{
      eventId: eventId
    }
  })
  return response.data
}

export const createCheckpoint = async (newObject: AddCheckpoint, eventId: number) => {
  const response = await axiosInstance.post<Checkpoint>("/checkpoints", {
    ...newObject,
    eventId: eventId
  })
  return response.data
}

export const removeCheckpoint = async (id: number) => {
  const response = await axiosInstance.delete(`/checkpoints/${id}`)
  return response.data
}

export const editCheckpoint = async (id: number, newObject: AddCheckpoint) => {
  const response = await axiosInstance.put(`/checkpoints/${id}`, newObject)
  return response.data
}
