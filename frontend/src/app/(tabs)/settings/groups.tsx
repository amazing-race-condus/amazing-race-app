import React from "react"
import { View } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/Notification"
import Groups from "@/components/Groups"
import AddNewButton from "@/components/addGroupButton"

const GroupSettings = () => {

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Stack.Screen options={{ headerShown: false }} />
        <Notification />
        <Groups />
      </View>
      <AddNewButton/>
    </View>
  )
}

export default GroupSettings