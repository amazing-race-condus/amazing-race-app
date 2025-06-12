import React from "react"
import { View, Text, Pressable } from "react-native"
import { styles } from "@/styles/commonStyles"
import { AxiosError } from "axios"
import { useDispatch } from "react-redux"
import { setNotification } from "@/reducers/notificationSlice"
import { AppDispatch } from "@/store/store"
import { generateRoutes } from "@/services/routeService"
import { handleAlert } from "@/utils/handleAlert"

const RouteGeneration = () => {
  const dispatch = useDispatch<AppDispatch>()

  const createRoutes = async () => {
    try {
      handleAlert({
        confirmText: "Luo reitit",
        title: "Vahvista reittien luonti",
        message: "Reittien luominen poistaa aikaisemmat reitit ja korvaa ne uusilla. Oletko varma että haluat luoda reitit?",
        onConfirm: async () =>  {
          const data = await generateRoutes()
          const routesAmount = data.routesAmount
          const groupsAmount = data.groupsAmount
          if (routesAmount >= groupsAmount) {
            dispatch(setNotification(`${routesAmount} reittiä luotu.`, "success"))
          } else {
            dispatch(setNotification(`${routesAmount} reittiä luotu. Jokaisella ryhmällä ei ole uniikkia reittiä.`, "warning"))
          }
        }
      })
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