import { styles } from "@/styles/commonStyles"
import { Text, View } from "react-native"
import { RouteInfo } from "@/types"
import { Entypo, FontAwesome5 } from "@expo/vector-icons"

type RouteStatsProps = {
  routes: RouteInfo[]
  activeRoutes: RouteInfo[]
  groupsLength: number
}

const RouteStats: React.FC<RouteStatsProps> = ({ routes, activeRoutes, groupsLength }) => {
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
            <Text style={styles.statItem}>Käytössä: <Text style={styles.statValue}>{routeTimes.length}</Text> / Ryhmiä yhteensä <Text style={styles.statValue}>{groupsLength}</Text></Text>
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