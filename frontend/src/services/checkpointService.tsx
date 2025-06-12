import axios from "axios"
import { url } from "../config"
import { Checkpoint, AddCheckpoint } from "@/types"
import store from "@/store/store"

export const getCheckpoint = async (id: string | string[]): Promise<Checkpoint> => {
  const response = await axios.get<Checkpoint>(`${url}/checkpoints/${id}`)
  return response.data
}

export const getAllCheckpoints = async (): Promise<Checkpoint[]> => {
  const eventId = store.getState().event.id
  const response = await axios.get<Checkpoint[]>(`${url}/checkpoints`,
    {
      params: { eventId : eventId }
    }
  )
  return response.data
}

export const createCheckpoint = async (newObject: AddCheckpoint) => {
  const eventId = store.getState().event.id
  const response = await axios.post<Checkpoint>(`${url}/checkpoints`,
    { ...newObject, eventId : eventId }
  )
  return response.data
}

export const removeCheckpoint = async (id: number) => {
  const response = await axios.delete(`${url}/checkpoints/${id}`)
  return response.data
}

export const editCheckpoint = async (id: number, newObject: AddCheckpoint) => {
  const request = axios.put(`${url}/checkpoints/${id}`, newObject)
  const response = await request
  return response.data
}
