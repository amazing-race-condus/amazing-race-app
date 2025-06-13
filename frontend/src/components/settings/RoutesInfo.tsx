import { View, Text, Dimensions } from "react-native"
import { styles } from "@/styles/commonStyles"
import { getRoutesInfo } from "@/services/routeService"
import store from "@/store/store"
import { useEffect, useState } from "react"

const screenWidth = Dimensions.get("window").width

type RouteInfo = { id: number, routeTime: number }

const RoutesInfo = () => {
  const eventId = store.getState().event.id
  const [routes, setRoutes] = useState<RouteInfo[]>([])

  useEffect(() => {
    const fetchRoutes = async () => {
      const data = await getRoutesInfo(eventId)
      setRoutes(data)
    }
    fetchRoutes()
  }, [eventId])

  const routeTimes = routes.map(r => r.routeTime)

  const median = routeTimes.length === 0
    ? 0
    : routeTimes[Math.floor(routeTimes.length / 2)]
  const mean = routeTimes.length === 0
    ? 0
    : routeTimes.reduce((sum, val) => sum + val, 0) / routeTimes.length

  if (routeTimes.length === 0) {
    return (
      <View style={styles.content}>
        <Text style={styles.header}>Reittien tiedot:</Text>
        <View style={styles.formContainer}>
          <Text style={[styles.formText,
            { width: Math.min(screenWidth * 0.8, 355) }
          ]}>Luo reitit nähdäksesi tiedot</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.content}>
      <Text style={styles.header}>Reittien tiedot:</Text>
      <View style={styles.formContainer}>
        <Text style={[styles.formText, { width: Math.min(screenWidth * 0.8, 355) }]} >Reittien lukumäärä: {routeTimes.length} </Text>
        <Text style={styles.formText}>Mediaani: {median} </Text>
        <Text style={styles.formText}>Lyhin reitti: {routeTimes[0]} </Text>
        <Text style={styles.formText}>Pisin reitti: {routeTimes[routeTimes.length - 1]} </Text>
      </View>
    </View>
  )
}

export default RoutesInfo