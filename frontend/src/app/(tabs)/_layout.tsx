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
          popToTopOnBlur: true,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="users" color={color} />,
        }}
      />
      <Tabs.Screen
        name="checkpoints"
        options={{
          title: "Rastit",
          headerShown: false,
          popToTopOnBlur: true,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="compass" color={color} />
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Asetukset",
          headerShown: false,
          popToTopOnBlur: true,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: "Kirjautuminen",
          headerShown: false,
          popToTopOnBlur: true,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
    </Tabs>
  )
}
