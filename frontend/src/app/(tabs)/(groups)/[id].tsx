import { Stack, useLocalSearchParams } from "expo-router"
import { Text, View } from "react-native"

const Team = () => {
  const { id, name } = useLocalSearchParams()

  return (
    <View >
      <Stack.Screen
        options={{ headerShown: false }}
      />
      <Text>{id}</Text>
      <Text>{name}</Text>
    </View>
  )
}

export default Team
