import { Text, View } from "react-native"
import { styles } from "@/styles/commonStyles"
import SettingsItem from "@/components/settings/SettingsItem"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import Logout from "@/components/ui/Logout"

const Settings = () => {
  const event = useSelector((state: RootState) => state.event)
  const user = useSelector((state: RootState) => state.user)
  const gameFinished = Boolean(event.endTime)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Asetukset</Text>
      { user.admin && (
        <>
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
            text="Hallinnoi käyttäjiä"
            link="/settings/users"
          />
        </>

      )}
      <SettingsItem
        text="Hallinnoi tapahtumia"
        link="/settings/events"
      />
      <SettingsItem
        text="Tulokset"
        link="/settings/results"
        dimmed={!gameFinished}
      />
      <Logout />
    </View>
  )
}

export default Settings
