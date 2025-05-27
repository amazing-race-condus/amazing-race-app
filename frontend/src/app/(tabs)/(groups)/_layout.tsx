import { Stack } from "expo-router"
import { GestureHandlerRootView } from "react-native-gesture-handler"

export const unstable_settings = {
  initialRouteName: "index"
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
          name="index"
        />
        <Stack.Screen
          name="addNew"
          options={{
            presentation: "transparentModal",
            animation: "none",
          }}
        />
        <Stack.Screen
          name="group/[id]"
        />
      </Stack>
    </GestureHandlerRootView>
  )
}
