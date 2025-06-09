import { Stack } from "expo-router"
import { Provider } from "react-redux"
import store from "@/store/store"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { ThemeProvider } from "@react-navigation/native"

export const unstable_settings = {
  initialRouteName: "/(tabs)/(groups)/index",
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <ThemeProvider value={{
          dark: false,
          colors: {
            primary: "black",
            background: "#003366",
            card: "white",
            text: "black",
            border: "white",
            notification: "white",
          },
          fonts: {
            regular: {
              fontFamily: "System",
              fontWeight: "normal",
            },
            medium: {
              fontFamily: "System",
              fontWeight: "600",
            },
            bold: {
              fontFamily: "System",
              fontWeight: "bold",
            },
            heavy: {
              fontFamily: "System",
              fontWeight: "900",
            },
          }
        }}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  )
}
