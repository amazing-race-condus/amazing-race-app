import { Text, View, Platform } from "react-native"
import { Provider } from "react-redux"
import { Link, Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import store from "@/store/store"
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

const AppProvider = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

export default AppProvider
