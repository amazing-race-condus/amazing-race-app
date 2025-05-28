import { ScrollView, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Notification from "@/components/Notification"
import AddCheckpoint from "@/components/addCheckpoint"
import RouteMinMax from "@/components/routeMinMax"
import RouteDistance from "@/components/routeDistance"
import { styles } from "@/styles/commonStyles"
import CheckpointSettings from "@/components/CheckpointSettings"

const Settings = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Notification />
        <Text style={styles.title}>Asetukset</Text>
        <AddCheckpoint />
        <RouteMinMax />
        <RouteDistance />
        <CheckpointSettings />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Settings
