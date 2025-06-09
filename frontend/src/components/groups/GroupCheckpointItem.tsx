import { Checkpoint, Group } from "@/types"
import { View, StyleSheet, Dimensions } from "react-native"
import { useState } from "react"
import theme from "@/theme"
import GroupCheckpointHeader from "./GroupCheckpointHeader"
import GroupCheckpointActions from "./GroupCheckpointActions"
import ListGroupCheckpointPenalties from "./ListGroupCheckpointPenalties"

const screenWidth = Dimensions.get("window").width

const GroupCheckpointItem = (
  { checkpoint, group, nextCheckpointId, completeCheckpoint, openHint }:
  { checkpoint: Checkpoint, group: Group, nextCheckpointId: number, completeCheckpoint: (id: number, skip: boolean) => void, openHint: () => void }
) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const CheckpointPenalties = group?.penalty?.filter(p => p.checkpointId === checkpoint.id)
  const isPenalties = (CheckpointPenalties.length > 0)
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
      <GroupCheckpointHeader
        checkpoint={checkpoint}
        isActive={isActiveCheckpoint}
        isExpanded={isExpanded}
        isPenalties={isPenalties}
        openHint={openHint}
        toggleExpanded={toggleExpanded}
      />
      { isActiveCheckpoint &&  (
        <GroupCheckpointActions
          checkpoint={checkpoint}
          group={group}
          usedHints={usedHints}
          completeCheckpoint={completeCheckpoint}
        />
      )}
      {((isActiveCheckpoint || isExpanded) && CheckpointPenalties?.length > 0) && (
        <ListGroupCheckpointPenalties
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
  }
})