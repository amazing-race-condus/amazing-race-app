import { Stack } from "expo-router"
import { GestureHandlerRootView } from "react-native-gesture-handler"

export const unstableSettings = {
  initialRouteName: "checkpointsList"
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
          name="checkpointsList"
        />
        <Stack.Screen
          name="[id]"
        />
      </Stack>
    </GestureHandlerRootView>
  )
}
