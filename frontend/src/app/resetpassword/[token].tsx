import React from "react"
import { View } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/ui/Notification"
import ResetPasswordForm from "@/components/forms/ResetPasswordForm"

const ResetPassword = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Notification />
      <ResetPasswordForm/>
    </View>
  )
}

export default ResetPassword