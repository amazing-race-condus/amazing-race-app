import { View, Text } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"

const AddCheckpoint = () => {

  return (
    <View style={styles.content}>
      <Stack.Screen
        options={{title: `Lisää rasti`}}
      />
      <Text>add-komponentti</Text>
    </View>
  )
}

export default AddCheckpoint