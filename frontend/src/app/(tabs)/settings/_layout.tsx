import { RootState } from "@/store/store"
import { Stack } from "expo-router"
import { useSelector } from "react-redux"

export default function Layout() {
  const user = useSelector((state: RootState) => state.user)

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
      />
      <Stack.Protected guard={user.admin}>
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
          name="users"
        />
      </Stack.Protected>
      <Stack.Screen
        name="events"
      />
      <Stack.Screen
        name="results"
      />
    </Stack>
  )
}
