import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Notification from "@/components/Notification"
import RouteMinMax from "@/components/routeMinMax"
import CheckpointDistance from "@/components/checkpointDistance"
import { styles } from "@/styles/commonStyles"

import { Link } from "expo-router"
import { Entypo } from "@expo/vector-icons"

const Settings = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
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
        <RouteMinMax />
        <CheckpointDistance />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Settings
