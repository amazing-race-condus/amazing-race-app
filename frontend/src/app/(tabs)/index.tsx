import { Text, View, Platform } from "react-native"
import { Provider } from "react-redux"
import { Link, Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import AppBar from "@/components/AppBar"
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
      <AppBar pageTitle='Home' />
      <Notification />
      <View style={styles.content}>
        <Text style={styles.header}>Condus Amazing Race App</Text>
      </View>
      <View style={styles.links}>
        <Link style={styles.link} href="/add_checkpoint">Lisää rasti</Link>
        <Link style={styles.link} href="/checkpoints">Rastit</Link>
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
