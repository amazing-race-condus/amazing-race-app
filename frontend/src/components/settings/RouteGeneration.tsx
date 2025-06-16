import React, { useEffect, useState } from "react"
import { View, Text, Pressable, ActivityIndicator } from "react-native"
import { styles } from "@/styles/commonStyles"
import { AxiosError } from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setNotification } from "@/reducers/notificationSlice"
import store, { AppDispatch, RootState } from "@/store/store"
import { generateRoutes, getActiveRoutesInfo, getRoutesInfo } from "@/services/routeService"
import { handleAlert } from "@/utils/handleAlert"
import { RouteInfo } from "@/types"
import RouteStats from "./RouteStats"

const RouteGeneration: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [routes, setRoutes] = useState<RouteInfo[]>([])
  const [activeRoutes, setActiveRoutes] = useState<RouteInfo[]>([])
  const [loading, setLoading] = useState(false)
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
        setLoading(true)
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
        } finally {
          setLoading(false)
        }
      }
    })
  }

  const fetchRoutes = async () => {
    const routesData = await getRoutesInfo(eventId)
    setRoutes(routesData)
    const activeRoutesData = await getActiveRoutesInfo(eventId)
    setActiveRoutes(activeRoutesData)
  }

  return (
    <View style={styles.content}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#003366" />
        </View>
      )}
      <Text style={styles.header}>Reitit:</Text>
      <View style={styles.formContainer}>
        <RouteStats
          routes={routes}
          activeRoutes={activeRoutes}
          groupsLength={useSelector((state: RootState) => state.groups.length)}
        />
        <Pressable style={styles.button} onPress={createRoutes}>
          <Text style={styles.buttonText}>Luo reitit</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default RouteGeneration