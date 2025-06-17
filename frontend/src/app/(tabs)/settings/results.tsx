import React from "react"
import { ScrollView, View } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import PassedGroupsResults from "@/components/results/PassedGroupsResults"

const Results = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Stack.Screen options={{ headerShown: false }} />
        <PassedGroupsResults />
      </ScrollView>
    </View>
  )
}

export default Results
