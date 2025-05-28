import { Stack } from "expo-router"
import { GestureHandlerRootView } from "react-native-gesture-handler"

export const unstable_settings = {
  initialRouteName: "settings/options"
}

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="options"
        />
      </Stack>
    </GestureHandlerRootView>
  )
}
