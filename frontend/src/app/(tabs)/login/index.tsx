import React, { useState } from "react"
import { View } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/ui/Notification"
import LoginForm from "@/components/forms/LoginForm"
import Logout from "@/components/ui/Logout"
import { User } from "@/types"

const Login = () => {
  const [user, setUser] = useState<User | undefined>(undefined)

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Notification />
      {user ? (
        <Logout setUser={setUser} />
      ) : (
        <LoginForm setUser={setUser} />
      )}
    </View>
  )
}

export default Login