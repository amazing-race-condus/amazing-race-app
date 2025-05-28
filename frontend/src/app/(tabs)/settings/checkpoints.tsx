import React from "react"
import { View } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/Notification"
import Checkpoints from "@/components/Checkpoints"
import AddNewButton from "@/components/addCheckpointButton"

const CheckpointSettings = () => {

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Stack.Screen options={{ headerShown: false }} />
        <Notification />
        <Checkpoints />
      </View>
      <AddNewButton/>
    </View>
  )
}

export default CheckpointSettings

