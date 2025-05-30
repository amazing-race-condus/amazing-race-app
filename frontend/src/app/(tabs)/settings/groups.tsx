import React from "react"
import { View, ScrollView } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/Notification"
import Groups from "@/components/Groups"
import AddNewButton from "@/components/addGroupButton"

const GroupSettings = () => {

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Stack.Screen options={{ headerShown: false }} />
        <Notification />
        <Groups />
      </ScrollView>
      <AddNewButton/>
    </View>
  )
}

export default GroupSettings