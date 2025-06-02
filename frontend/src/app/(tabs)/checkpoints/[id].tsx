import { View, Text } from "react-native"
import { useLocalSearchParams, Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import { RootState } from "@/store/store"
import { useSelector } from "react-redux"

const Checkpoint = () => {
  const { id } = useLocalSearchParams()
  const checkpoint = useSelector((state: RootState) =>
    state.checkpoints.find(g => g.id === Number(id))
  )

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Stack.Screen
          options={{ headerShown: false }}
        />
        <Text style={styles.title}>{checkpoint?.name}</Text>
        <Text style={styles.breadText}>Tähän toiminnallisuutta</Text>
      </View>
    </View>
  )
}

export default Checkpoint
