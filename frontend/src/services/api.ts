import axios from "axios"
import { url } from "../config"
import { storageUtil } from "@/utils/storageUtil"
import AsyncStorage from "@react-native-async-storage/async-storage"

const axiosInstance = axios.create({
  baseURL: url,
  timeout: 45000,
})

axiosInstance.interceptors.request.use(
  async (config) => {
    const user = await storageUtil.getUser()
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user?.token}`
    }

    return config
  },
  (error) => {
    console.error("Request error:", error)
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    if (error.response?.status === 400 || error.response?.status === 401) {
      if (error.response.data.error === "Invalid token" || error.response.data.error === "Token expired") {
        await AsyncStorage.removeItem("user")
        const { default: store } = await import("@/store/store")
        store.dispatch({ type: "RESET" })
      }
    }

    if (error.response?.status >= 500) {
      console.error("Server error:", error.response.data)
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
