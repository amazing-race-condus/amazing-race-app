import { View, Text } from "react-native"
import { styles } from "@/styles/commonStyles"
import { RootState } from "@/store/store"
import { useSelector } from "react-redux"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const Notification = () => {
  const { message, type } = useSelector((state: RootState) => state.message)
  const insets = useSafeAreaInsets()
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
    <View style={[backgroundStyle, {
      top: insets.top + 50,
      position: "absolute",
      alignSelf: "center",
      zIndex: 999, }]}>
      <Text style={textStyle}>{ message }</Text>
    </View>
  )
}

export default Notification