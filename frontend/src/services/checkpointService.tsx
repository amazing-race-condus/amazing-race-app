import axios from "axios"
import { Platform } from "react-native"
import { Checkpoint, AddCheckpoint } from "@/types"

const url =
  Platform.OS === "web"
    ? process.env.EXPO_PUBLIC_WEB_BACKEND_URL
    : process.env.EXPO_PUBLIC_BACKEND_URL

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
