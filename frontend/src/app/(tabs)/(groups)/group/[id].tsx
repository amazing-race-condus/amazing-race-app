import { AppDispatch } from "@/store/store"
import { Stack, useLocalSearchParams, useRouter } from "expo-router"
import { Pressable, Text, View } from "react-native"
import { useDispatch } from "react-redux"
import { removeGroupReducer } from "@/reducers/groupSlice"

const Team = () => {
  const { id, name } = useLocalSearchParams<{id: string, name: string}>()
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const handleSubmit = () => {
    dispatch(removeGroupReducer(id, name))
    router.back()
  }

  return (
    <View >
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
