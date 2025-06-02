import { givePenaltyReducer } from "@/reducers/groupSlice"
import { AppDispatch } from "@/store/store"
import { styles } from "@/styles/commonStyles"
import { Checkpoint, Group } from "@/types"
import { getType } from "@/utils/checkpointUtils"
import { View, Pressable, Text } from "react-native"
import { useDispatch } from "react-redux"

const GroupCheckpointItem = (
  { checkpoint, group, nextCheckpointId, completeCheckpoint }:
  { checkpoint: Checkpoint, group: Group, nextCheckpointId: number, completeCheckpoint: (id: number) => void }
) => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const translatedType = getType(checkpoint.type)

  const CheckpointPenalties = group?.penalty.filter(p => p.checkpointId === checkpoint.id) || []

  return (
    <View style={styles.item}>
      <Text style={styles.checkpointName}>
        {checkpoint.name}
        {translatedType !== "" && (
          <Text style={styles.checkpointType}> {translatedType}</Text>
        )}
      </Text>
      { checkpoint.id === nextCheckpointId && (
        <View style={styles.content}>
          <Pressable
            onPress={() => dispatch(givePenaltyReducer(group.id, checkpoint.id, "SKIP", 30))}
            style={styles.smallButton2}
          >
            <Text style={styles.buttonText}>Skip</Text>
          </Pressable>
          <Pressable
            onPress={() => completeCheckpoint(checkpoint.id)}
            style={styles.smallButton2}
          >
            <Text style={styles.buttonText}>Suorita</Text>
          </Pressable>
          <Pressable
            onPress={() => dispatch(givePenaltyReducer(group.id, checkpoint.id, "HINT", 5))}
            style={styles.smallButton2}
          >
            <Text style={styles.buttonText}>Vihjepuhelin</Text>
          </Pressable>
          <Pressable
            onPress={() => dispatch(givePenaltyReducer(group.id, checkpoint.id, "OVERTIME", 5))}
            style={styles.smallButton2}
          >
            <Text style={styles.buttonText}>Yliaika</Text>
          </Pressable>
          <Pressable
            onPress={() => console.log("vihje")}
            style={styles.smallButton2}
          >
            <Text style={styles.buttonText}>Vihje</Text>
          </Pressable>
        </View>
      )}
      {CheckpointPenalties?.map(p =>
        <Text key={p.id} style={styles.breadText}>• {p.time}</Text>
      )}
    </View>
  )
}

export default GroupCheckpointItem
