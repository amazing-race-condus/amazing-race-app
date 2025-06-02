import React from "react"
import { View, ScrollView } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/Notification"
import Checkpoints from "@/components/Checkpoints"
import AddNewButton from "@/components/addCheckpointButton"

const CheckpointSettings = () => {

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Stack.Screen options={{ headerShown: false }} />
        <Notification />
        <Checkpoints />
      </ScrollView>
      <AddNewButton/>
    </View>
  )
}

export default CheckpointSettings

