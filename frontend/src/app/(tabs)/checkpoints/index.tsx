import React from "react"
import { View } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import Checkpoints from "@/components/checkpoints/Checkpoints"

const CheckpointsList = () => {

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Checkpoints />
    </View>
  )
}

export default CheckpointsList
