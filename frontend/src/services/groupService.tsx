import axios from "axios"
import { url } from "../config"
import { AddGroup, Group } from "@/types"

export const getAllGroups = async (eventId: number): Promise<Group[]> => {
  const response = await axios.get<Group[]>(`${url}/groups`,{
    params :{
      eventId: eventId
    }
  }
  )
  return response.data
}

export const getArrivingGroups = async (checkpointId: number): Promise<Group[]> => {
  const response = await axios.get<Group[]>(`${url}/groups/by_next_checkpoint/${checkpointId}`)
  return response.data
}

export const createGroup = async (newGroup: AddGroup, eventId: number) => {
  const response = await axios.post<Group>(`${url}/groups`,{
    ...newGroup,
    eventId: eventId
  })
  return response.data
}

export const removeGroup = async (id: number) => {
  const request = axios.delete(`${url}/groups/${id}`)
  const response = await request
  return response.data
}

export const giveNextCheckpoint = async (id: number, checkpointId: number) => {
  const response = await axios.put<Group>(`${url}/groups/next_checkpoint/${id}`, {nextCheckpointId: checkpointId})
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

export const editGroup = async (id: number, newObject: AddGroup) => {
  const request = axios.put(`${url}/groups/${id}`, newObject)
  const response = await request
  return response.data
}
