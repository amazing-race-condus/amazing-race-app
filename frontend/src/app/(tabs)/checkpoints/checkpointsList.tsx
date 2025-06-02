import React from "react"
import { View } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/Notification"
import Checkpoints from "@/components/Checkpoints"

const CheckpointsList = () => {

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Notification />
      <Checkpoints />
    </View>
  )
}

export default CheckpointsList
