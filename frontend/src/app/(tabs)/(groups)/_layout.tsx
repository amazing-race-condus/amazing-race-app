import { Stack } from "expo-router"
import { GestureHandlerRootView } from "react-native-gesture-handler"

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen
          name="(groups)/addNew"
          options={{
            presentation: "transparaentModal",
            headerShown: false,
            animation: "none",
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  )
}
