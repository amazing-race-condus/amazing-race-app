import { Text, View, Platform } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/Notification"

const url =
  Platform.OS === "web"
    ? process.env.EXPO_PUBLIC_WEB_BACKEND_URL
    : process.env.EXPO_PUBLIC_BACKEND_URL

const App = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Notification />
      <View style={styles.content}>
        <Text style={styles.title}>Ryhmät</Text>
      </View>
    </View>
  )
}

export default App
