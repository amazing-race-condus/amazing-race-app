import React, { useEffect, useState } from "react"
import { View, Text, Pressable } from "react-native"
import { styles } from "@/styles/commonStyles"
import { AxiosError } from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setNotification } from "@/reducers/notificationSlice"
import store, { AppDispatch, RootState } from "@/store/store"
import { generateRoutes, getActiveRoutesInfo, getRoutesInfo } from "@/services/routeService"
import { handleAlert } from "@/utils/handleAlert"
import { RouteInfo } from "@/types"

const RouteGeneration: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const eventId = store.getState().event.id

  useEffect(() => {
    fetchRoutes()
  }, [eventId])

  const createRoutes = async () => {
    handleAlert({
      confirmText: "Luo reitit",
      title: "Vahvista reittien luonti",
      message: "Reittien luominen poistaa aikaisemmat reitit ja korvaa ne uusilla. Oletko varma että haluat luoda reitit?",
      onConfirm: async () => {
        try {
          const data = await generateRoutes(eventId)
          const routesAmount = data.routesAmount
          const groupsAmount = data.groupsAmount
          await fetchRoutes()
          if (routesAmount >= groupsAmount) {
            dispatch(setNotification(`${routesAmount} reittiä luotu.`, "success"))
          } else {
            dispatch(setNotification(
              `${routesAmount} reittiä luotu. Jokaisella ryhmällä ei ole uniikkia reittiä.`,
              "warning"
            ))
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            dispatch(setNotification(
              error.response?.data.error ?? `Reittejä ei voitu luoda: ${error.message}`,
              "error"
            ))
          }
        }
      }
    })
  }

  const groups = useSelector((state: RootState) => state.groups)
  const [routes, setRoutes] = useState<RouteInfo[]>([])
  const [activeRoutes, setActiveRoutes] = useState<RouteInfo[]>([])

  const fetchRoutes = async () => {
    const routesData = await getRoutesInfo(eventId)
    setRoutes(routesData)
    const activeRoutesData = await getActiveRoutesInfo(eventId)
    setActiveRoutes(activeRoutesData)
  }

  const routeTimes = activeRoutes.map(r => r.routeTime)

  const median = routeTimes.length === 0
    ? 0
    : routeTimes[Math.floor(routeTimes.length / 2)]

  return (
    <View style={styles.content}>
      <Text style={styles.header}>Luo reitit:</Text>
      <View style={styles.formContainer}>
        {routeTimes.length > 0 &&
        <>
          <Text style={styles.formText} >Reittien lukumäärä: {routes.length} kpl </Text>
          <Text style={styles.formText}>Käytössä: {routeTimes.length} kpl / Ryhmiä yhteensä {groups.length} kpl </Text>
          <Text style={styles.formText}>Mediaanipituus: {median} min </Text>
          <Text style={styles.formText}>Lyhin reitti: {routeTimes[0]} min </Text>
          <Text style={styles.formText}>Pisin reitti: {routeTimes[routeTimes.length - 1]} min </Text>
        </>
        }
        <Pressable style={styles.button} onPress={createRoutes}>
          <Text>Luo reitit</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default RouteGeneration