import { givePenaltyReducer } from "@/reducers/groupSlice"
import { AppDispatch } from "@/store/store"
import { Checkpoint, CompleteType, Group, Penalty } from "@/types"
import { View, StyleSheet } from "react-native"
import { useDispatch } from "react-redux"
import theme from "@/theme"
import ActionButton from "../ui/ActionButton"
import { handleAlert } from "@/utils/handleAlert"

const GroupCheckpointNotActiveActions = (
  { checkpoint, group, usedHints, usedSkip, usedOvertime, completeCheckpoint }:
  {
    checkpoint: Checkpoint
    group: Group
    usedHints: Penalty[]
    usedSkip: Penalty[]
    usedOvertime: Penalty[]
    passed: number[]
    completeCheckpoint: (id: number, skip: CompleteType) => void
  }
) => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()

  if (checkpoint.type === "START") {
    return (
      <ActionButton
        style={styles.button}
        onPress={() => completeCheckpoint(checkpoint.id, "NORMAL")}
        text={"Aloita"}
      />
    )
  }

  if (checkpoint.type === "FINISH") {
    return (
      <ActionButton
        style={styles.button}
        onPress={() => completeCheckpoint(checkpoint.id, "NORMAL")}
        text={"Lopeta"}
      />
    )
  }

  return (
    <View style={{ flexDirection: "column"}}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <ActionButton
          style={[
            styles.button,
            ...(usedOvertime.length > 0 || usedSkip.length > 0  ? [{ opacity: 0.4}] : [])
          ]}
          onPress={() => {
            if (usedOvertime.length === 0 && usedSkip.length === 0) {
              handleAlert({
                confirmText: "Skip",
                title: "Skippauksen rangaistus",
                message: "Oletko varma, että haluat merkata rastin skipatuksi? Ryhmä saa 30 min rangaistuksen",
                onConfirm: async () => {
                  dispatch(givePenaltyReducer(group.id, checkpoint.id, "SKIP", 30))
                },
              })
            }
          }}
          text={"Skip"}
        />
        <ActionButton
          style={styles.button}
          onPress={() => {
            if (usedHints.length > 2) {
              handleAlert({
                confirmText: "Vihjepuhelin",
                title: "Vahvista vihjepuhelinrangaistus",
                message: "Ryhmällä on jo 3 vihjepuhelinsoittoa. Haluatko varmasti antaa neljännen rangaistuksen?",
                onConfirm: async () => {
                  dispatch(givePenaltyReducer(group.id, checkpoint.id, "HINT", 5))
                },
              })
            } else {
              dispatch(givePenaltyReducer(group.id, checkpoint.id, "HINT", 5))
            }
          }}
          text={"Vihjepuhelin"}
        />
        <ActionButton
          style={[
            styles.button,
            ...(usedOvertime.length > 0 || usedSkip.length > 0 ? [{ opacity: 0.4}] : [])
          ]}
          onPress={() => {
            if (usedOvertime.length === 0 && usedSkip.length === 0){

              handleAlert({
                confirmText: "Yliaika",
                title: "Yliaika rangaistus",
                message: "Oletko varma, että haluat merkata rastin yliajaksi? Ryhmä saa 5 min rangaistuksen",
                onConfirm: async () => {
                  dispatch(givePenaltyReducer(group.id, checkpoint.id, "OVERTIME", 5))
                },
              })
            }
          }}
          text={"Yliaika"}
        />
      </View>
    </View>
  )
}

export default GroupCheckpointNotActiveActions

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