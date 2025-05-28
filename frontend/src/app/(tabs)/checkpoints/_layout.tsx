import { Stack } from "expo-router"
import { GestureHandlerRootView } from "react-native-gesture-handler"

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
          name="addNew"
          options={{
            presentation: "transparentModal",
            animation: "none",
          }}
        />
        <Stack.Screen
          name="[id]"
        />
      </Stack>
    </GestureHandlerRootView>
  )
}
