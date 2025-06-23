import { View, Text } from "react-native"
import { FontAwesome5 } from "@expo/vector-icons"
import { styles } from "@/styles/commonStyles"

export const GameStartItem = ({ text, checkBoolean }: { text: string, checkBoolean: boolean }) => {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statItem}>{"\u2022"} {text} </Text>
      {checkBoolean
        ? <FontAwesome5 name="check" color="green" testID="check-icon" />
        : <FontAwesome5 name="times" color="red" testID="times-icon" />
      }
    </View>
  )
}

export default GameStartItem
