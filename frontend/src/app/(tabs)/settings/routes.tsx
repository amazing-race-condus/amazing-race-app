import React from "react"
import { ScrollView, View } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import RouteMinMax from "@/components/settings/RouteMinMax"
import CheckpointDistance from "@/components/checkpoints/checkpointDistance"
import RouteGeneration from "@/components/settings/RouteGeneration"

const RouteSettings = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Stack.Screen options={{ headerShown: false }} />
        <RouteMinMax />
        <CheckpointDistance />
        <RouteGeneration />
      </ScrollView>
    </View>
  )
}

export default RouteSettings