import { Checkpoint } from "@/types"
import { getType } from "@/utils/checkpointUtils"
import React from "react"
import { Pressable, View, Text, StyleSheet } from "react-native"
import ActionButton from "../ui/ActionButton"
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import theme from "@/theme"

const GroupCheckpointHeader = (
  {checkpoint, isActive, isExpanded, isPenalties, isPassed, openHint, toggleExpanded}:
  {
    checkpoint: Checkpoint
    isActive: boolean
    isExpanded: boolean
    isPenalties: boolean
    isPassed: boolean
    openHint: () => void
    toggleExpanded: () => void
  }
) => {
  const translatedType = getType(checkpoint.type)

  return (
    <Pressable style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 3 }} onPress={toggleExpanded}>
      <View style={{ flexDirection: "row", flex: 1, alignItems: "center", alignContent: "center" }}>
        <Text style={styles.title}>{checkpoint.name}</Text>
        {translatedType !== "" && (
          <Text style={styles.checkpointType}>{translatedType}</Text>
        )}
      </View>
      { isActive ? (
        (checkpoint.type !== "START") && (
          <ActionButton
            style={styles.hintButton}
            onPress={openHint}
            text={"Vihje"}
          />)
      ) :
        <View style={{ marginHorizontal: 10 }}>
          {checkpoint.type !== "START" && checkpoint.type !== "FINISH" && isPassed && (
            isExpanded
              ? <FontAwesome6 name="chevron-up" size={24} color="black" />
              : <FontAwesome6 name="chevron-down" size={24} color="black" />
          )}
        </View>
      }
    </Pressable>
  )
}

export default GroupCheckpointHeader

const styles = StyleSheet.create({
  title: {
    marginLeft: 3,
    fontSize: 18,
    maxWidth: "78%",
    fontWeight: "bold"
  },
  hintButton: {
    margin: 1,
    height: 30,
    width: "25%",
    backgroundColor: theme.colors.button,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  checkpointType: {
    marginHorizontal: 2,
    textAlign: "center",
    backgroundColor: "silver",
    width: "20%",
    padding: 2,
    borderRadius: 6,
  },
})