import axios from "axios"
import { Platform } from "react-native"
import { Checkpoint } from "@/types"

const url =
  Platform.OS === "web"
    ? process.env.EXPO_PUBLIC_WEB_BACKEND_URL
    : process.env.EXPO_PUBLIC_BACKEND_URL

// export const getCheckpoint = async (id: string | string[]): Promise<Checkpoint> => {
//   const response = await axios
//     .get<Checkpoint>(`${url}/checkpoints/${id}`)
//   return response.data
// }

export const getAllGroups = async (): Promise<Checkpoint[]> => {
  const response = await axios
    .get<Checkpoint[]>(`${url}/groups`)
  return response.data
}

// export const createCheckpoint = async (newObject: Checkpoint) => {
//   const response = await axios.post<Checkpoint>(`${url}/checkpoints`, newObject)
//   return response.data
// }

// export const removeCheckpoint = async (id: string) => {
//   const request = axios.delete(`${url}/checkpoints/${id}`)
//   const response = await request
//   return response.data
// }
