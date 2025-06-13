import {  View } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import Groups from "@/components/groups/Groups"

const App = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Groups />
    </View>
  )
}

export default App
