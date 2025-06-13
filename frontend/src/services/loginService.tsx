import axios from "axios"
import { User } from "@/types"
import { url } from "../config"

export const login = async (username: string, password: string, admin: boolean) => {
  const response = await axios.post<User>(`${url}/login`, {username, password, admin})
  return response.data
}
