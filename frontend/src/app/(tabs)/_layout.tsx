import FontAwesome from "@expo/vector-icons/FontAwesome"
import { Tabs, useRouter } from "expo-router"
import { Platform } from "react-native"

export const unstable_settings = {
  initialRouteName: "/(tabs)/(groups)/index",
}

export default function TabLayout() {
  const router = useRouter()

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
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (navigation.isFocused() && Platform.OS === "web") {
              router.replace("/")
            }
          }
        })}
      />
      <Tabs.Screen
        name="checkpoints"
        options={{
          title: "Rastit",
          headerShown: false,
          popToTopOnBlur: true,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="compass" color={color} />
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (navigation.isFocused() && Platform.OS === "web") {
              router.replace("/checkpoints")
            }
          }
        })}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Asetukset",
          headerShown: false,
          popToTopOnBlur: true,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (navigation.isFocused() && Platform.OS === "web") {
              router.replace("/settings")
            }
          }
        })}
      />
    </Tabs>
  )
}
