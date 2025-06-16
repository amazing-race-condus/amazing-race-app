import axios from "axios"
import { url } from "../config"
import AsyncStorage from "@react-native-async-storage/async-storage"
// import { useRouter } from "expo-router"

const axiosInstance = axios.create({
  baseURL: url,
  timeout: 10000,
})

axiosInstance.interceptors.request.use(
  async (config) => {
    const userInfo = await AsyncStorage.getItem("user-info")
    if (userInfo) {
      const user = JSON.parse(userInfo)
      const userToken = user.token

      if (userToken) {
        config.headers.Authorization = `Bearer ${userToken}`
      }
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
