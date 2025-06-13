import { styles } from "@/styles/commonStyles"
import { ViewStyle, Pressable, Text } from "react-native"

const ActionButton = (
  { onPress, count, text, style }:
  { onPress: () => void, count?: number, text: string, style?: ViewStyle | ViewStyle[]}
) => {
  return (
    <Pressable
      onPress={onPress}
      style={style}
    >
      <Text style={styles.buttonText}> {text} {count ? `(${count}x)` : ""} </Text>
    </Pressable>
  )
}

export default ActionButton
