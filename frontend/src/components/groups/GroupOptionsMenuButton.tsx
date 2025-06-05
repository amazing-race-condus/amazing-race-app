import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import React from "react"
import { Pressable } from "react-native"
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"

const GroupOptionsMenuButton = ({ ref }: {ref: React.RefObject<BottomSheetMethods | null>} ) => {
  return (
    <Pressable
      style={{
        position: "absolute",
        top: 40,
        right: 20,
        width: 50,
        height: 50,
        zIndex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
      onPress={() => ref.current?.expand()}
    >
      <FontAwesome6 name="ellipsis-vertical" size={24} color="black" />
    </Pressable>
  )
}

export default GroupOptionsMenuButton
