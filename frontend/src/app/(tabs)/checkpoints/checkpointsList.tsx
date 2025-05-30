import React from "react"
import { View, ScrollView } from "react-native"
import { Stack, usePathname } from "expo-router"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/Notification"
import Checkpoints from "@/components/Checkpoints"
import AddNewButton from "@/components/addCheckpointButton"

const CheckpointsList = () => {
  const pathname = usePathname()

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Stack.Screen options={{ headerShown: false }} />
        <Notification />
        <Checkpoints />
      </ScrollView>
      {pathname.startsWith("/settings") && (
        <AddNewButton/>
      )}

    </View>
  )
}

export default CheckpointsList
