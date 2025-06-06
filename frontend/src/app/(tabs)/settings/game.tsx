import React from "react"
import { View } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/ui/Notification"
import GameView from "@/components/settings/GameView"

const CheckpointSettings = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Notification />
      <GameView />
    </View>
  )
}

export default CheckpointSettings