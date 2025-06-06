import { removePenaltyReducer } from "@/reducers/groupSlice"
import { AppDispatch } from "@/store/store"
import { Penalty } from "@/types"
import React from "react"
import { View, Pressable, Text, StyleSheet } from "react-native"
import { useDispatch } from "react-redux"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"

const ListCheckpointPenalties = (
  { groupId, usedHints, usedSkip, usedOvertime }:
  {
    groupId: number
    usedHints: Penalty[]
    usedSkip: Penalty[]
    usedOvertime: Penalty[]
  }
) => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()

  return (
    <View style={styles.penaltyContainer}>
      <Text style={styles.penaltyTitle}>Rankut:</Text>
      {usedHints.length > 0 && (
        <View style={styles.penaltyItem}>
          <Text style={styles.penaltyText}>
                Vihjepuhelin ({usedHints.length}x): {usedHints.length * usedHints[0]?.time}min
          </Text>
          <Pressable
            testID="deleteHintButton"
            style={styles.deleteButton}
            onPress={() => dispatch(removePenaltyReducer(groupId, usedHints[0].id))}
          >
            <MaterialIcons name="delete" size={20} color="#ff4444" />
          </Pressable>
        </View>
      )}
      {usedSkip.length > 0 && (
        <View style={styles.penaltyItem}>
          <Text style={styles.penaltyText}>
                Skip: {usedSkip[0]?.time}min
          </Text>
          <Pressable
            style={styles.deleteButton}
            onPress={() => dispatch(removePenaltyReducer(groupId, usedSkip[0].id))}
          >
            <MaterialIcons name="delete" size={20} color="#ff4444" />
          </Pressable>
        </View>
      )}
      {usedOvertime.length > 0 && (
        <View style={styles.penaltyItem}>
          <Text style={styles.penaltyText}>
                Yliaika: {usedOvertime[0]?.time}min
          </Text>
          <Pressable
            style={styles.deleteButton}
            onPress={() => dispatch(removePenaltyReducer(groupId, usedOvertime[0].id))}
          >
            <MaterialIcons name="delete" size={20} color="#ff4444" />
          </Pressable>
        </View>
      )}
    </View>
  )
}

export default ListCheckpointPenalties

const styles = StyleSheet.create({
  penaltyContainer: {
    backgroundColor: "rgba(255, 92, 108, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(255, 92, 108, 0.5)",
    borderRadius: 12,
    marginTop: 8,
    padding: 12,
  },
  penaltyTitle: {
    fontSize: 16,
    fontWeight: "bold"
  },
  penaltyText: {
    fontWeight: "500",
  },
  penaltyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginVertical: 2,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 8,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "rgba(255, 68, 68, 0.1)",
  },
})
