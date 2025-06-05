import { View, Text } from "react-native"
import { styles } from "@/styles/commonStyles"
import { RootState } from "@/store/store"
import { useSelector } from "react-redux"

const Notification = () => {
  const { message, type } = useSelector((state: RootState) => state.message)
  if (!message) {
    return null
  }

  let backgroundStyle
  const textStyle = (type === "warning" ? styles.warningText : styles.breadText)

  switch (type) {
  case "error":
    backgroundStyle = styles.error
    break
  case "warning":
    backgroundStyle = styles.warning
    break
  default:
    backgroundStyle = styles.notification
  }

  return (
    <View style={backgroundStyle}>
      <Text style={textStyle}>{ message }</Text>
    </View>
  )
}

export default Notification