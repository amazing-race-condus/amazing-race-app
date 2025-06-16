import axiosInstance from "./api"
import { User } from "@/types"

export const login = async (username: string, password: string, admin: boolean) => {
  const response = await axiosInstance.post<User>("/login", {username, password, admin})
  return response.data
}
