import { View, Text } from "react-native"
import { styles } from "@/styles/commonStyles"

const RouteStatItem = ({ title, value, unit }: { title: string, value: number | null, unit: string }) => {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statItem}>{"\u2022"} {title}: <Text style={styles.statValue}>
        {value !== null && value !== undefined ? value : "n/a"} {value !== null && value !== undefined ? unit : ""}</Text></Text>
    </View>
  )
}

export default RouteStatItem
