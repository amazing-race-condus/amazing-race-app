import { useCallback } from "react"
import {  View } from "react-native"
import { useDispatch } from "react-redux"
import { Stack, useFocusEffect, usePathname } from "expo-router"
import { AppDispatch } from "@/store/store"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/Notification"
import { fetchGroups } from "@/reducers/groupSlice"
import AddNewButton from "@/components/addGroupButton"
import Groups from "@/components/Groups"

const App = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchGroups())
    }, [dispatch])
  )

  const pathname = usePathname()

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Notification />
      <Groups />
      {pathname.startsWith("/settings") && (
        <AddNewButton/>
      )}

    </View>
  )
}

export default App
