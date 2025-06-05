import { givePenaltyReducer, removePenaltyReducer } from "@/reducers/groupSlice"
import { AppDispatch } from "@/store/store"
import { Checkpoint, Group, Penalty } from "@/types"
import { getType } from "@/utils/checkpointUtils"
import { View, Pressable, Text, StyleSheet, Dimensions } from "react-native"
import { useDispatch } from "react-redux"
import { useState } from "react"
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import theme from "@/theme"
import ActionButton from "./ActionButton"

const screenWidth = Dimensions.get("window").width

const CheckpointHeader = (
  {checkpoint, isActive, isExpanded, openHint, toggleExpanded}:
  {
    checkpoint: Checkpoint
    isActive: boolean
    isExpanded: boolean
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
          {isExpanded
            ? <FontAwesome6 name="chevron-up" size={24} color="black" />
            : <FontAwesome6 name="chevron-down" size={24} color="black" />
          }
        </View>
      }
    </Pressable>
  )
}

const CheckpointActions = (
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

const GroupCheckpointItem = (
  { checkpoint, group, nextCheckpointId, completeCheckpoint, openHint }:
  { checkpoint: Checkpoint, group: Group, nextCheckpointId: number, completeCheckpoint: (id: number) => void, openHint: () => void }
) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const CheckpointPenalties = group?.penalty?.filter(p => p.checkpointId === checkpoint.id)
  const isActiveCheckpoint = checkpoint.id === nextCheckpointId

  const usedHints = CheckpointPenalties?.filter(p => p.type === "HINT")
  const usedSkip = CheckpointPenalties?.filter(p => p.type === "SKIP")
  const usedOvertime = CheckpointPenalties?.filter(p => p.type === "OVERTIME")

  const toggleExpanded = () => {
    if (!isActiveCheckpoint) {
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <View style={[styles.item, { backgroundColor: isActiveCheckpoint ? theme.colors.listItemBackground : "rgba(187, 183, 183, 0.75)" }]}>
      <CheckpointHeader
        checkpoint={checkpoint}
        isActive={isActiveCheckpoint}
        isExpanded={isExpanded}
        openHint={openHint}
        toggleExpanded={toggleExpanded}
      />
      { isActiveCheckpoint &&  (
        <CheckpointActions
          checkpoint={checkpoint}
          group={group}
          usedHints={usedHints}
          completeCheckpoint={completeCheckpoint}
        />
      )}
      {((isActiveCheckpoint || isExpanded) && CheckpointPenalties.length > 0) && (
        <ListCheckpointPenalties
          groupId={group.id}
          usedHints={usedHints}
          usedSkip={usedSkip}
          usedOvertime={usedOvertime}
        />
      )}
    </View>
  )
}

export default GroupCheckpointItem

const styles = StyleSheet.create({
  item: {
    flexDirection: "column",
    padding: 8,
    backgroundColor: theme.colors.listItemBackground,
    width: Math.min(screenWidth * 0.9, 320),
    borderRadius: 12
  },
  title: {
    marginLeft: 3,
    fontSize: 18,
    maxWidth: "78%",
    fontWeight: "bold"
  },
  penaltyTitle: {
    fontSize: 16,
    fontWeight: "bold"
  },
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
  buttonText: {
    color: theme.colors.textButton,
    fontSize: theme.fontSizes.button,
    fontWeight: "600",
  },
  checkpointType: {
    marginHorizontal: 2,
    textAlign: "center",
    backgroundColor: "silver",
    width: "20%",
    padding: 2,
    borderRadius: 6,
  },
  penaltyContainer: {
    backgroundColor: "rgba(255, 92, 108, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(255, 92, 108, 0.5)",
    borderRadius: 12,
    marginTop: 8,
    padding: 12,
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
  penaltyText: {
    fontWeight: "500",
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "rgba(255, 68, 68, 0.1)",
  },
})