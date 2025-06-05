import { Stack } from "expo-router"

export const unstableSettings = {
  initialRouteName: "index"
}

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
      />
      <Stack.Screen
        name="group/[id]"
      />
    </Stack>
  )
}
