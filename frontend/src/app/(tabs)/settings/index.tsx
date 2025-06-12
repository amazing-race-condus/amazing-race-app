import { Text, View } from "react-native"
import Notification from "@/components/ui/Notification"
import { styles } from "@/styles/commonStyles"
import SettingsItem from "@/components/settings/SettingsItem"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

const Settings = () => {
  const event = useSelector((state: RootState) => state.event)
  const gameFinished = Boolean(event.endTime)

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
      <SettingsItem
        text="Hallinnoi tapahtumia"
        link="/settings/events"
      />
      <SettingsItem
        text="Tulokset"
        link="/settings/results"
        dimmed={!gameFinished}
      />
    </View>
  )
}

export default Settings
