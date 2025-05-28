import FontAwesome from "@expo/vector-icons/FontAwesome"
import { Tabs } from "expo-router"

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="(groups)"
        options={{
          title: "Ryhmät",
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="users" color={color} />,
        }}
      />
      <Tabs.Screen
        name="checkpoints"
        options={{
          title: "Rastit",
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="compass" color={color} />
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Asetukset",
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
    </Tabs>
  )
}
