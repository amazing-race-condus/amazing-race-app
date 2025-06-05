import { View, Text } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { RootState, AppDispatch } from "@/store/store"
import { fetchCheckpoints } from "@/reducers/checkpointsSlice"
import { sortCheckpoints } from "@/utils/checkpointUtils"
import { usePathname } from "expo-router"
import CheckpointItem from "./CheckpointItem"

const Checkpoints = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const checkpoints = useSelector((state: RootState) => state.checkpoints)
  const pathname = usePathname()

  useEffect(() => {
    dispatch(fetchCheckpoints())
  }, [dispatch])

  const sortedCheckpoints = sortCheckpoints(checkpoints)

  const ItemSeparator = () => <View style={styles.separator} />

  return (
    <View style={styles.content}>
      {pathname.startsWith("/settings") && (
        <Text style={styles.header}>Hallinnoi rasteja:</Text>
      )}
      {pathname.startsWith("/checkpoints") && (
        <Text style={styles.title}>Rastit:</Text>
      )}
      {sortedCheckpoints.map((item, index) => (
        <View key={item.id}>
          <CheckpointItem item = { item } />
          {index < sortedCheckpoints.length - 1 && <ItemSeparator />}
        </View>
      ))}
    </View>
  )
}

export default Checkpoints
