import React from "react"
import { View, Text, Pressable, Platform } from "react-native"
import { styles } from "@/styles/commonStyles"
import axios, { AxiosError } from "axios"
import { useDispatch } from "react-redux"
import { setNotification } from "@/reducers/notificationSlice"
import { AppDispatch } from "@/store/store"

const RouteGeneration = () => {
  const url =
        Platform.OS === "web"
          ? process.env.EXPO_PUBLIC_WEB_BACKEND_URL
          : process.env.EXPO_PUBLIC_BACKEND_URL
  const dispatch = useDispatch<AppDispatch>()

  const createRoutes = async () => {
    try {
      const response = await axios.put(`${url}/settings/create_routes`)
      const routesAmount = response.data.routesAmount
      const groupsAmount = response.data.groupsAmount
      if (routesAmount >= groupsAmount) {
        dispatch(setNotification(`${routesAmount} reittiä luotu.`, "success"))
      } else {
        dispatch(setNotification(`${routesAmount} reittiä luotu. Jokaisella ryhmällä ei ole uniikkia reittiä.`, "warning"))
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch(setNotification(
          error.response?.data.error ?? `Reittejä ei voitu luoda: ${error.message}`, "error"
        ))
      }
    }
  }

  return (
    <View style={styles.content}>
      <Text style={styles.header}>Luo reitit:</Text>
      <View style={styles.formContainer}>
        <Pressable style={styles.button} onPress={() => {createRoutes()}}>
          <Text>Luo reitit</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default RouteGeneration