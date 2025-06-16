import axios from "axios"
import { url } from "../config"
// import { useRouter } from "expo-router"
import { storageUtil } from "@/utils/storageUtil"

const axiosInstance = axios.create({
  baseURL: url,
  timeout: 10000,
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
  (error) => {
    // const router = useRouter()
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      // await AsyncStorage.removeItem("user-info")
      // router.replace("/")
    }

    if (error.response?.status >= 500) {
      console.error("Server error:", error.response.data)
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
