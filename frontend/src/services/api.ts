import axios from "axios"
import { url } from "../config"
// import { useRouter } from "expo-router"
import { storageUtil } from "@/utils/storageUtil"
import store from "@/store/store"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Platform } from "react-native"
// import { CommonActions } from "@react-navigation/native"
// import { useNavigationContainerRef } from "expo-router"
// const navigationRef = useNavigationContainerRef()

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
    // console.log("Hep22")
    return response
  },
  async (error) => {
    //const router = useRouter()
    if (error.response?.status === 400) {
      if (error.response.data.error === "Invalid token") {
        // console.log("Hep")
        //store.dispatch({ type: "RESET" }) // This resets the Redux state
        await AsyncStorage.removeItem("user")
        // if (Platform.OS === "web") {
        //   window.location.reload() // For web; for React Native, reset navigation
        // } else {
        store.dispatch({ type: "RESET" })
        // navigationRef.current?.dispatch(
        //   CommonActions.reset({
        //     index: 0,
        //     routes: [{ name: 'Login' }], // or your initial route
        //   })
        // )
        //}
      }
    }

    if (error.response?.status >= 500) {
      console.error("Server error:", error.response.data)
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
