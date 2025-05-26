import { AppDispatch } from "@/store/store"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import { Platform, Pressable, Text, View } from "react-native"
import { useDispatch } from "react-redux"
import { removeGroupReducer } from "@/reducers/groupSlice"

const Team = () => {
  const { id, name } = useLocalSearchParams<{id: string, name: string}>()
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const handleSubmit = () => {
    dispatch(removeGroupReducer(id, name))
    if (Platform.OS !== "ios") {
      router.navigate("/")
    } else {
      router.back()
    }
  }

  return (
    <View style={{ marginTop: 75 }}>
      <Stack.Screen
        options={{ headerShown: false }}
      />
      <Text>{id}</Text>
      <Text>{name}</Text>

      <Pressable onPress={handleSubmit}>
        <Text> delete </Text>
      </Pressable>
    </View>
  )
}

export default Team
