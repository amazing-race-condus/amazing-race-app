import { View, Text, FlatList } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import store, { RootState, AppDispatch } from "@/store/store"
import { fetchCheckpoints } from "@/reducers/checkpointsSlice"
import { sortCheckpoints } from "@/utils/checkpointUtils"
import { usePathname } from "expo-router"
import CheckpointItem from "./CheckpointItem"
import { Checkpoint } from "@/types"

const Checkpoints = ({ onEditCheckpoint }: { onEditCheckpoint?: (checkpoint: Checkpoint) => void }) => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const eventId = store.getState().event.id
  const checkpoints = useSelector((state: RootState) => state.checkpoints)
  const pathname = usePathname()

  useEffect(() => {
    dispatch(fetchCheckpoints(eventId))
  }, [dispatch])

  const sortedCheckpoints = sortCheckpoints(checkpoints)

  return (
    <View style={[styles.content, { flex: 1 }]}>
      {pathname.startsWith("/settings") && (
        <Text style={styles.header}>Hallinnoi rasteja:</Text>
      )}
      {pathname.startsWith("/checkpoints") && (
        <Text style={styles.title}>Rastit</Text>
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
