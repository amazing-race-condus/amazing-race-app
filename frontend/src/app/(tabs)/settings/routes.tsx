import React from "react"
import { View } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/Notification"
import RouteMinMax from "@/components/routeMinMax"
import CheckpointDistance from "@/components/checkpointDistance"

const RouteSettings = () => {

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Stack.Screen options={{ headerShown: false }} />
        <Notification />
        <RouteMinMax />
        <CheckpointDistance />
      </View>
    </View>
  )
}

export default RouteSettings