import React from "react"
import { ScrollView, View, Text } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import RouteMinMax from "@/components/settings/RouteMinMax"
import CheckpointDistance from "@/components/checkpoints/CheckpointDistance"
import RouteGeneration from "@/components/settings/RouteGeneration"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

const RouteSettings = () => {
  const event = useSelector((state: RootState) => state.event)
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={{ flexDirection: "column", justifyContent: "center" }}>
          <Text style={styles.header}>Hallinnoi reittejä</Text>
          <Text style={[styles.header, { fontSize: 15, marginTop: 0 }]}>{event.name} </Text>
        </View>
        <RouteMinMax />
        <CheckpointDistance />
        <RouteGeneration />
      </ScrollView>
    </View>
  )
}

export default RouteSettings