import {  View } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/ui/Notification"
import Groups from "@/components/groups/Groups"
import store, { AppDispatch } from "@/store/store"
import { getEventReducer } from "@/reducers/eventSlice"
import { useDispatch } from "react-redux"

const App = () => {
  // const dispatch: AppDispatch = useDispatch<AppDispatch>()
  // const id = store.getState().event.id
  // dispatch(getEventReducer(id))

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Notification />
      {/* <Groups /> */}
    </View>
  )
}

export default App
