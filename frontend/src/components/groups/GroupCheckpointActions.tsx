import { givePenaltyReducer } from "@/reducers/groupSlice"
import { AppDispatch } from "@/store/store"
import { Checkpoint, Group, Penalty } from "@/types"
import { View, StyleSheet } from "react-native"
import { useDispatch } from "react-redux"
import theme from "@/theme"
import ActionButton from "../ui/ActionButton"

const GroupCheckpointActions = (
  { checkpoint, group, usedHints, completeCheckpoint }:
  {
    checkpoint: Checkpoint
    group: Group
    usedHints: Penalty[]
    completeCheckpoint: (id: number) => void
  }
) => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()

  if (checkpoint.type === "START") {
    return (
      <ActionButton
        style={styles.button}
        onPress={() => completeCheckpoint(checkpoint.id)}
        text={"Aloita"}
      />
    )
  }

  if (checkpoint.type === "FINISH") {
    return (
      <ActionButton
        style={styles.button}
        onPress={() => completeCheckpoint(checkpoint.id)}
        text={"Lopeta"}
      />
    )
  }

  return (
    <View style={{ flexDirection: "column"}}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <ActionButton
          style={styles.button}
          onPress={() => dispatch(givePenaltyReducer(group.id, checkpoint.id, "SKIP", 30))}
          text={"Skip"}
        />
        <ActionButton
          style={styles.button}
          onPress={() => completeCheckpoint(checkpoint.id)}
          text={"Suorita"}
        />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <ActionButton
          style={styles.button}
          onPress={() => dispatch(givePenaltyReducer(group.id, checkpoint.id, "HINT", 5))}
          count={usedHints.length}
          text={"Vihjepuhelin"}
        />
        <ActionButton
          style={styles.button}
          onPress={() => dispatch(givePenaltyReducer(group.id, checkpoint.id, "OVERTIME", 5))}
          text={"Yliaika"}
        />
      </View>
    </View>
  )
}

export default GroupCheckpointActions

const styles = StyleSheet.create({
  button: {
    margin: 2,
    height: 45,
    flex: 1,
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
})