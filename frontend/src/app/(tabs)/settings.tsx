import { ScrollView, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Notification from "@/components/Notification"
import AddCheckpoint from "@/components/addCheckpoint"
import RouteMinMax from "@/components/routeMinMax"
import CheckpointDistance from "@/components/checkpointDistance"
import RouteGeneration from "@/components/routeGeneration"
import { styles } from "@/styles/commonStyles"
import Checkpoints from "@/components/Checkpoints"

const Settings = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Notification />
        <Text style={styles.title}>Asetukset</Text>
        <AddCheckpoint />
        <RouteMinMax />
        <RouteGeneration />
        <CheckpointDistance />
        <Checkpoints />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Settings
