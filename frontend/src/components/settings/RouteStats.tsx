import { styles } from "@/styles/commonStyles"
import { Text, View } from "react-native"
import { RouteInfo } from "@/types"
import { FontAwesome5 } from "@expo/vector-icons"
import RouteStatItem from "./RouteStatItem"

type RouteStatsProps = {
  routes: RouteInfo[]
  activeRoutes: RouteInfo[]
  groupsLength: number
}

const RouteStats: React.FC<RouteStatsProps> = ({ routes, activeRoutes, groupsLength }) => {
  const routeTimes = routes.map(r => r.routeTime)
  const median = routeTimes.length === 0
    ? null
    : routeTimes[Math.floor(routeTimes.length / 2)]

  const activeRouteTimes = activeRoutes.map(r => r.routeTime)
  const activeMedian = activeRouteTimes.length === 0
    ? null
    : activeRouteTimes[Math.floor(activeRouteTimes.length / 2)]

  return (
    <View style={styles.statsCard}>
      {routes.length > 0 ?
        <View>
          <View style={styles.statTitle}>
            <FontAwesome5 name="route" size={20} color="#003366" />
            <Text style={styles.statTitle}> Reittien tilastot </Text>
            <FontAwesome5 name="chart-bar" size={20} color="#003366" />
          </View>
          <View style={styles.statTitle}>
            <Text style={styles.statTitle}> Kaikki reitit </Text>
          </View>
          <RouteStatItem
            title="Reittien lukumäärä"
            value={routes.length}
            unit="kpl"
          />
          <RouteStatItem
            title="Mediaanipituus"
            value={median}
            unit="min"
          />
          <RouteStatItem
            title="Lyhin reitti"
            value={routeTimes[0]}
            unit="min"
          />
          <RouteStatItem
            title="Pisin reitti"
            value={routeTimes[routeTimes.length - 1]}
            unit="min"
          />
          <View style={styles.statTitle}>
            <Text style={styles.statTitle}> Käytössä olevat reitit </Text>
          </View>
          <RouteStatItem
            title="Lukumäärä"
            value={activeRouteTimes.length}
            unit="kpl"
          />
          <RouteStatItem
            title="Ryhmiä yhteensä"
            value={groupsLength}
            unit="kpl"
          />
          <RouteStatItem
            title="Mediaanipituus"
            value={activeMedian}
            unit="min"
          />
          <RouteStatItem
            title="Lyhin reitti"
            value={activeRouteTimes[0]}
            unit="min"
          />
          <RouteStatItem
            title="Pisin reitti"
            value={activeRouteTimes[activeRouteTimes.length - 1]}
            unit="min"
          />
        </View>
        : <Text style={styles.statItem}>Ei tietoja - luo reitit nähdäksesi tilastoja.</Text>
      }
    </View>
  )
}

export default RouteStats