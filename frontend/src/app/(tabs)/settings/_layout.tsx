import { Stack } from "expo-router"

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
        name="checkpoints"
      />
      <Stack.Screen
        name="groups"
      />
      <Stack.Screen
        name="routes"
      />
      <Stack.Screen
        name="game"
      />
      <Stack.Screen
        name="results"
      />
      <Stack.Screen
        name="events"
      />
    </Stack>
  )
}
