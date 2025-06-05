import { Text, View } from "react-native"
import Notification from "@/components/ui/Notification"
import { styles } from "@/styles/commonStyles"
import SettingsItem from "@/components/settings/SettingsItem"

const Settings = () => {
  return (
    <View style={styles.container}>
      <Notification />
      <Text style={styles.title}>Asetukset</Text>
      <SettingsItem
        text="Hallinnoi rasteja"
        link="/settings/checkpoints"
      />
      <SettingsItem
        text="Hallinnoi ryhmiä"
        link="/settings/groups"
      />
      <SettingsItem
        text="Hallinnoi reittejä"
        link="/settings/routes"
      />
      <SettingsItem
        text="Hallinnoi peliä"
        link="/settings/game"
      />
    </View>
  )
}

export default Settings
