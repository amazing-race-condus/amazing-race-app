import { View, Text } from "react-native"
import { styles } from "@/styles/commonStyles"
import { RootState } from "@/store/store"
import { useSelector } from "react-redux"

const Notification = () => {
  const { message, type } = useSelector((state: RootState) => state.message)
  if (!message) {
    return null
  }

  const style = type === "error" ? styles.error : styles.notification

  return (
    <View style={style}>
      <Text style={styles.breadText}>{ message }</Text>
    </View>
  )
}

export default Notification
