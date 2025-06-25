import React from "react"
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import { Pressable } from "react-native"

const AddNewButton = ({ onPress }: { onPress: () => void }) => {

  return (
    <Pressable
      onPress={onPress}
      role="button"
      style={({ pressed }) => [{
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "orange",
        width: 56,
        height: 56,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
      }, {
        opacity: pressed ? 0.5 : 1
      }]}
    >
      <FontAwesome6 name="plus" size={24} color="white" />
    </Pressable>
  )
}

export default AddNewButton
