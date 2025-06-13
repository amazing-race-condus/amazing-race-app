import FontAwesome from "@expo/vector-icons/FontAwesome"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Tabs } from "expo-router"
import { useEffect, useState } from "react"

export const unstable_settings = {
  initialRouteName: "/(tabs)/(groups)/index",
}

export default function TabLayout() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  useEffect(() => {
    const loadToken = async () => {
      try {
        const userJson = await AsyncStorage.getItem("user-info")
        if (userJson === null) {
          return
        }
        const parsedUser = JSON.parse(userJson)
        setIsAdmin(parsedUser.admin)
      } catch (error) {
        console.error("Failed to load user token:", error)
      }
    }
    loadToken()
  }, [])

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
      <Tabs.Protected guard={isAdmin}>
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
    </Tabs>
  )
}
