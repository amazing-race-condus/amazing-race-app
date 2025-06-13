import { RootState } from "@/store/store"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { Tabs } from "expo-router"
import { useSelector } from "react-redux"

export const unstable_settings = {
  initialRouteName: "/(tabs)/(groups)/index",
}

export default function TabLayout() {
  const user = useSelector((state: RootState) => state.user)

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
      <Tabs.Protected guard={user.admin}>
        <Tabs.Screen
          name="settings"
          options={{
            title: "Asetukset",
            headerShown: false,
            popToTopOnBlur: true,
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
          }}
        />
      </Tabs.Protected>
      <Tabs.Protected guard={!user.admin}>
        <Tabs.Screen
          name="logout"
          options={{
            title: "Kirjaudu ulos",
            headerShown: false,
            popToTopOnBlur: true,
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="sign-out" color={color} />,
          }}
        />
      </Tabs.Protected>
    </Tabs>
  )
}
