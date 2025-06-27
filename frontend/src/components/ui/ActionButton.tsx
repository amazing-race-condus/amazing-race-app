import { styles } from "@/styles/commonStyles"
import { ViewStyle, Text, TouchableOpacity } from "react-native"

const ActionButton = (
  { onPress, count, text, style }:
  { onPress: () => void, count?: number, text: string, style?: ViewStyle | ViewStyle[]}
) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={style}
    >
      <Text style={styles.buttonText}> {text} {count ? `(${count}x)` : ""} </Text>
    </TouchableOpacity>
  )
}

export default ActionButton
