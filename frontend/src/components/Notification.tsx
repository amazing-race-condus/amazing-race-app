import { View, Text } from "react-native"
import { styles } from "@/styles/commonStyles"
import store, { AppDispatch, RootState } from "@/store/store"
import { useDispatch, useSelector } from "react-redux"

const Notification = () => {
  // const dispatch: AppDispatch = useDispatch<AppDispatch>()
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

export default Notification
