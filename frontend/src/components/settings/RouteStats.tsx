import { styles } from "@/styles/commonStyles"
import { Text, View } from "react-native"
import { useEffect, useState } from "react"
import store, { RootState } from "@/store/store"
import { getRoutesInfo, getActiveRoutesInfo } from "@/services/routeService"
import { RouteInfo } from "@/types"
import { useSelector } from "react-redux"
import { Entypo, FontAwesome5 } from "@expo/vector-icons"

const RouteStats = () => {
  const eventId = store.getState().event.id

  useEffect(() => {
    fetchRoutes()
  }, [eventId])

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
    <View style={styles.routeStatsCard}>
      {routeTimes.length > 0 ?
        <View>
          <View style={styles.statTitle}>
            <FontAwesome5 name="route" size={20} color="#003366" />
            <Text style={styles.statTitle}> Reittien tilastot </Text>
            <FontAwesome5 name="chart-bar" size={20} color="#003366" />
          </View>
          <View style={styles.statRow}>
            <Entypo name="dot-single" size={22} color="#333" />
            <Text style={styles.statItem}>Reittien lukumäärä: <Text style={styles.statValue}>{routes.length} kpl</Text></Text>
          </View>
          <View style={styles.statRow}>
            <Entypo name="dot-single" size={22} color="#333" />
            <Text style={styles.statItem}>Käytössä: <Text style={styles.statValue}>{routeTimes.length}</Text> / Ryhmiä yhteensä <Text style={styles.statValue}>{groups.length}</Text></Text>
          </View>
          <View style={styles.statRow}>
            <Entypo name="dot-single" size={22} color="#333" />
            <Text style={styles.statItem}>Mediaanipituus: <Text style={styles.statValue}>{median} min</Text></Text>
          </View>
          <View style={styles.statRow}>
            <Entypo name="dot-single" size={22} color="#333" />
            <Text style={styles.statItem}>Lyhin reitti: <Text style={styles.statValue}>{routeTimes[0]} min</Text></Text>
          </View>
          <View style={styles.statRow}>
            <Entypo name="dot-single" size={22} color="#333" />
            <Text style={styles.statItem}>Pisin reitti: <Text style={styles.statValue}>{routeTimes[routeTimes.length - 1]} min</Text></Text>
          </View>
        </View>
        : <Text style={styles.statItem}>Ei tietoja - luo reitit nähdäksesi statistiikkaa.</Text>
      }
    </View>
  )
}

export default RouteStats