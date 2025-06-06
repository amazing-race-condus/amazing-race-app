import { useCallback } from "react"
import {  View } from "react-native"
import { useDispatch } from "react-redux"
import { Stack, useFocusEffect } from "expo-router"
import { AppDispatch } from "@/store/store"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/ui/Notification"
import { fetchGroups } from "@/reducers/groupSlice"
import Groups from "@/components/groups/Groups"

const App = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchGroups())
    }, [dispatch])
  )

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Notification />
      <Groups />
    </View>
  )
}

export default App
