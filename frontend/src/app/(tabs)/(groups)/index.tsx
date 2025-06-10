import { useCallback } from "react"
import {  View } from "react-native"
import { useDispatch } from "react-redux"
import { Stack, useFocusEffect } from "expo-router"
import { AppDispatch } from "@/store/store"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/ui/Notification"
import { fetchGroups } from "@/reducers/groupSlice"
import Groups from "@/components/groups/Groups"
import { getEventReducer } from "@/reducers/eventSlice"

const App = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const eventId = 1

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchGroups())
      dispatch(getEventReducer(eventId))
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
