import { View, Text } from "react-native"
import { styles } from "@/styles/commonStyles"
import store, { RootState } from "@/store/store"
import { Provider, useSelector } from "react-redux"

const Notification = () => {
  const message = useSelector((state: RootState) => state.message)
  if (message === "") {
    return null
  }

  return (
    <View style={styles.notification}>
      <Text style={styles.breadText}>{ message }</Text>
    </View>
  )
}

const NotificationProvider = () => (
  <Provider store={store}>
    <Notification />
  </Provider>
)

export default NotificationProvider
