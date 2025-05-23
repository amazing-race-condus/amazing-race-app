import { View } from "react-native"
import Notification from "@/components/Notification"
import AddCheckpoint from "@/components/add_checkpoint"
import RouteMinMax from "@/components/routeMinMax"
import { styles } from "@/styles/commonStyles"

const Settings = () => {
  return (
    <View style={styles.container}>
      <Notification />
      <AddCheckpoint />
      <RouteMinMax />
    </View>
  )
}

export default Settings
