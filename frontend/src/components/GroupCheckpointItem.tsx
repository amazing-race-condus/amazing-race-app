import { styles } from "@/styles/commonStyles"
import { Checkpoint } from "@/types"
import { getType } from "@/utils/checkpointUtils"
import { View, Pressable, Text } from "react-native"

const GroupCheckpointItem = (
  { checkpoint, nextCheckpointId, completeCheckpoint }:
  { checkpoint: Checkpoint, nextCheckpointId: number, completeCheckpoint: (id: number) => void }
) => {
  const translatedType = getType(checkpoint.type)
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
            onPress={() => console.log("skip")}
            style={styles.smallButton2}
          >
            <Text style={styles.buttonText}>Skip</Text>
          </Pressable>
          <Pressable
            onPress={() => completeCheckpoint(Number(checkpoint.id))}
            style={styles.smallButton2}
          >
            <Text style={styles.buttonText}>Suorita</Text>
          </Pressable>
          <Pressable
            onPress={() => console.log("Vihjepuhelin")}
            style={styles.smallButton2}
          >
            <Text style={styles.buttonText}>Vihjepuhelin</Text>
          </Pressable>
          <Pressable
            onPress={() => console.log("yliaika")}
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

    </View>
  )
}

export default GroupCheckpointItem
