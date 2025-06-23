import React from "react"
import { ScrollView, View, Text } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import RouteMinMax from "@/components/settings/RouteMinMax"
import CheckpointDistance from "@/components/checkpoints/checkpointDistance"
import RouteGeneration from "@/components/settings/RouteGeneration"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

const RouteSettings = () => {
  const event = useSelector((state: RootState) => state.event)
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.header}>Hallinnoi reittejä {event.name} </Text>
        <RouteMinMax />
        <CheckpointDistance />
        <RouteGeneration />
      </ScrollView>
    </View>
  )
}

export default RouteSettings