import React from "react"
import { ScrollView, View, Text } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import PassedGroupsResults from "@/components/groups/PassedGroupsResults"

const Results = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.title}>Tulokset</Text>
        <PassedGroupsResults />
      </ScrollView>
    </View>
  )
}

export default Results
