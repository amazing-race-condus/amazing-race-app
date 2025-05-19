import { View, Text } from "react-native"
import { useLocalSearchParams, Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import { getCheckpoint } from "@/services/checkpointService"
import { useEffect, useState } from "react"
import AppBar from "@/components/AppBar"

const Checkpoint = () => {
  const { id } = useLocalSearchParams()
  const [name, setName] = useState("Loading...")

  useEffect(() => {
    const fetchCheckpoint = async () => {
      try {
        const data = await getCheckpoint(id)
        setName(data.name)
      } catch (error) {
        console.error(error)
        setName("Error")
      }
    }

    if (id) fetchCheckpoint()
  }, [id])

  return (
    <View style={styles.content}>
      <Stack.Screen
        options={{ headerShown: false }}
      />
      <AppBar pageTitle={name} />
      <Text style={styles.breadText}>Tähän toiminnallisuutta</Text>
    </View>
  )
}

export default Checkpoint
