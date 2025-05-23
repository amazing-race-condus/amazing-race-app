import React from "react"
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import { Link, useRouter } from "expo-router"
import { Pressable } from "react-native"

const AddNewButton = () => {
  const router = useRouter()

  return (
    <Pressable
      onPress={() => router.push("/(tabs)/(groups)/addNew")}
      style={{
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "orange",
        width: 56,
        height: 56,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FontAwesome6 name="plus" size={24} color="white" />
    </Pressable>
  )
}

export default AddNewButton
