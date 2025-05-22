import { View, Text } from "react-native"
import Notification from "@/components/Notification"
import AddCheckpoint from "@/components/add_checkpoint"
import { styles } from "@/styles/commonStyles"
import CheckpointSettings from "@/components/CheckpointSettings"

const Settings = () => {
  return (
    <View style={styles.container}>
      <Notification />
      <Text style={styles.title}>Asetukset</Text>
      <AddCheckpoint />
      <CheckpointSettings />
    </View>
  )
}

export default Settings
