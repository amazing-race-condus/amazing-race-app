import { View, Text, FlatList } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { sortCheckpoints } from "@/utils/checkpointUtils"
import { usePathname } from "expo-router"
import CheckpointItem from "./CheckpointItem"
import { Checkpoint } from "@/types"

const Checkpoints = ({ onEditCheckpoint }: { onEditCheckpoint?: (checkpoint: Checkpoint) => void }) => {
  const event = useSelector((state: RootState) => state.event)
  const checkpoints = useSelector((state: RootState) => state.checkpoints)
  const pathname = usePathname()

  const sortedCheckpoints = sortCheckpoints(checkpoints)

  return (
    <View style={[styles.content, { flex: 1 }]}>
      {pathname.startsWith("/settings") && (
        <View style={{ flexDirection: "column", justifyContent: "center" }}>
          <Text style={styles.header}>Hallinnoi rasteja</Text>
          <Text style={[styles.title, { fontSize: 15, marginTop: 0 }]}>{event.name} </Text>
        </View>

      )}
      {pathname.startsWith("/checkpoints") && (
        <View style={{ flexDirection: "column", justifyContent: "center" }}>
          <Text style={styles.header}>Rastit</Text>
          <Text style={[styles.title, { fontSize: 15, marginTop: 0 }]}>{event.name} </Text>
        </View>
      )}
      <FlatList
        data={sortedCheckpoints}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <CheckpointItem item ={item} onEditCheckpoint={onEditCheckpoint}/>
        )}
      />
    </View>
  )
}

export default Checkpoints
