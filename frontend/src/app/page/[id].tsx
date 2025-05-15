import { View, Text } from "react-native"
import { useLocalSearchParams, Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"

const Page = () => {
  const { id } = useLocalSearchParams()

  return (
    <View style={styles.content}>
      <Stack.Screen
        options={{title: `sivu ${ id }`}}
      />
      <Text>Page-komponentti</Text>
    </View>
  )
}

export default Page
