import { styles } from "@/styles/commonStyles"
import { ViewStyle, Pressable, Text } from "react-native"

const ActionButton = (
  { onPress, count, text, style }:
  { onPress: () => void, count?: number, text: string, style?: ViewStyle | ViewStyle[]}
) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [style, {opacity: pressed ? 0.5 : 1 }]}
    >
      <Text style={styles.buttonText}> {text} {count ? `(${count}x)` : ""} </Text>
    </Pressable>
  )
}

export default ActionButton
