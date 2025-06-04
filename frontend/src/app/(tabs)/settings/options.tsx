import { Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Notification from "@/components/Notification"
import { styles } from "@/styles/commonStyles"

import { Link } from "expo-router"
import { Entypo } from "@expo/vector-icons"

const Settings = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Notification />
        <Text style={styles.title}>Asetukset</Text>
        <Link href={"/settings/checkpoints"} asChild>
          <TouchableOpacity style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.checkpointName}>
                Hallinnoi rasteja
              </Text>
            </View>
            <Entypo name="chevron-right" size={24} color="black" />
          </TouchableOpacity>
        </Link>
        <Link href={"/settings/groups"} asChild>
          <TouchableOpacity style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.checkpointName}>
                Hallinnoi ryhmiä
              </Text>
            </View>
            <Entypo name="chevron-right" size={24} color="black" />
          </TouchableOpacity>
        </Link>
        <Link href={"/settings/routes"} asChild>
          <TouchableOpacity style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.checkpointName}>
                Hallinnoi reittejä
              </Text>
            </View>
            <Entypo name="chevron-right" size={24} color="black" />
          </TouchableOpacity>
        </Link>

        <Link href={"/settings/game"} asChild>
          <TouchableOpacity style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.checkpointName}>
                Hallinnoi peliä
              </Text>
            </View>
            <Entypo name="chevron-right" size={24} color="black" />
          </TouchableOpacity>
        </Link>

      </View>
    </SafeAreaView>
  )
}

export default Settings
