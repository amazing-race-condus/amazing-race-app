import axios from "axios"
import { url } from "../config"
import { Checkpoint, AddCheckpoint } from "@/types"

export const getCheckpoint = async (id: string | string[]): Promise<Checkpoint> => {
  const response = await axios.get<Checkpoint>(`${url}/checkpoints/${id}`)
  return response.data
}

export const getAllCheckpoints = async (): Promise<Checkpoint[]> => {
  const response = await axios.get<Checkpoint[]>(`${url}/checkpoints`)
  return response.data
}

export const createCheckpoint = async (newObject: AddCheckpoint) => {
  const response = await axios.post<Checkpoint>(`${url}/checkpoints`, newObject)
  return response.data
}

export const removeCheckpoint = async (id: number) => {
  const response = await axios.delete(`${url}/checkpoints/${id}`)
  return response.data
}

export const editCheckpoint = async (id: number, newObject: AddCheckpoint) => {
  const response = await axios.put(`${url}/checkpoints/${id}`, newObject)
  return response.data
}
