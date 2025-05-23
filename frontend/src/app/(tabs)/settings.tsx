import { View, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Notification from "@/components/Notification"
import AddCheckpoint from "@/components/add_checkpoint"
import { styles } from "@/styles/commonStyles"
import CheckpointSettings from "@/components/CheckpointSettings"

const Settings = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Notification />
      <Text style={styles.title}>Asetukset</Text>
      <AddCheckpoint />
      <CheckpointSettings />
    </SafeAreaView>
  )
}

export default Settings
