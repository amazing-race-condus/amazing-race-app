import axiosInstance from "./api"
import { User } from "@/types"
import axios from "axios"
import { url } from "../config"

export const login = async (username: string, password: string, admin: boolean) => {
  const response = await axiosInstance.post<User>("/login", {username, password, admin})
  return response.data
}

export const sendResetPasswordMail = async () => {
  const response = await axiosInstance.post("/authentication/reset_password")
  return response.data
}

export const resetPassword = async (newPassword: string, token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  const response = await axios.put(`${url}/authentication/reset_password`, { password: newPassword }, config)
  return response.data
}
