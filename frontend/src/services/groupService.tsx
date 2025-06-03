import axios from "axios"
import { Platform } from "react-native"
import { AddGroup, Group } from "@/types"

const url =
  Platform.OS === "web"
    ? process.env.EXPO_PUBLIC_WEB_BACKEND_URL
    : process.env.EXPO_PUBLIC_BACKEND_URL

export const getAllGroups = async (): Promise<Group[]> => {
  const response = await axios.get<Group[]>(`${url}/groups`)
  return response.data
}

export const getArrivingGroups = async (checkpointId: number): Promise<Group[]> => {
  const response = await axios.get<Group[]>(`${url}/groups/by_next_checkpoint/${checkpointId}`)
  return response.data
}

export const createGroup = async (newGroup: AddGroup) => {
  const response = await axios.post<Group>(`${url}/groups`, newGroup)
  return response.data
}

export const removeGroup = async (id: number) => {
  const request = axios.delete(`${url}/groups/${id}`)
  const response = await request
  return response.data
}

export const giveNextCheckpoint = async (id: number, checkpointId: number) => {
  const response = await axios.put<Group[]>(`${url}/groups/next_checkpoint/${id}`, {nextCheckpointId: checkpointId})
  return response.data
}

export const dnfGroup = async (id: number) => {
  const request = axios.put(`${url}/groups/${id}/dnf`)
  const response = await request
  return response.data
}

export const disqualifyGroup = async (id: number) => {
  const request = axios.put(`${url}/groups/${id}/disqualify`)
  const response = await request
  return response.data
}
