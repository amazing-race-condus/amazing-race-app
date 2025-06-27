import { View, Text, Pressable } from "react-native"
import { styles } from "@/styles/commonStyles"
import { AppDispatch, RootState } from "@/store/store"
import { useSelector, useDispatch } from "react-redux"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { removeNotificationReducer } from "@/reducers/notificationSlice"

const Notification = () => {
  const dispatch: AppDispatch = useDispatch()
  const { message, type } = useSelector((state: RootState) => state.notification)
  const insets = useSafeAreaInsets()
  if (!message) {
    return null
  }

  const handleRemoveNotification = () => {
    dispatch(removeNotificationReducer())
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
      zIndex: 999,  flexDirection: "row", justifyContent: "space-between",}]}>
      <Pressable onPress={() => handleRemoveNotification()} style={{ paddingRight: 25}}>
        <Text style={textStyle}>{ message }</Text>
        <Text style={{position: "absolute", top: 0, right: 0, color: "rgba(255, 255, 255, 0.7)"}}>[X]</Text>
      </Pressable>
    </View>
  )
}

export default Notification