import axios from "axios"
import { Platform } from "react-native"
import { Group } from "@/types"

const url =
  Platform.OS === "web"
    ? process.env.EXPO_PUBLIC_WEB_BACKEND_URL
    : process.env.EXPO_PUBLIC_BACKEND_URL

export const getGroup = async (id: string | string[]): Promise<Group> => {
  const response = await axios
    .get<Group>(`${url}/groups/${id}`)
  return response.data
}

export const getAllGroups = async (): Promise<Group[]> => {
  const response = await axios
    .get<Group[]>(`${url}/groups`)
  return response.data
}

export const createGroup = async (newObject: Group) => {
  const response = await axios.post<Group>(`${url}/groups`, newObject)
  return response.data
}

export const updateGroupPenalty = async (id: string, penalty: number) => {
  const response = await axios.put<Group>(`${url}/groups/${id}`, { penalty })
  return response.data
}

export const removeGroup = async (id: string) => {
  const request = axios.delete(`${url}/groups/${id}`)
  const response = await request
  return response.data
}
