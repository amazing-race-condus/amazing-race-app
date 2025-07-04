import React from "react"
import { View } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/ui/Notification"
import ChangePasswordForm from "@/components/forms/ChangePasswordForm"

const userSettings = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Notification />
      <ChangePasswordForm />
    </View>
  )
}

export default userSettings