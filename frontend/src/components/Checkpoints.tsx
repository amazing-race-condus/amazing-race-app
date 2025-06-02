import { View, Text, Pressable, Alert, Platform, TouchableOpacity } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { RootState, AppDispatch } from "@/store/store"
import { fetchCheckpoints, removeCheckpointReducer } from "@/reducers/checkpointsSlice"
import { getType, sortCheckpoints } from "@/utils/checkpointUtils"
import { usePathname, Link } from "expo-router"
import { Entypo } from "@expo/vector-icons"
import { Checkpoint } from "@/types"

const Checkpoints = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const checkpoints = useSelector((state: RootState) => state.checkpoints)
  const pathname = usePathname()

  useEffect(() => {
    dispatch(fetchCheckpoints())
  }, [dispatch])

  const sortedCheckpoints = sortCheckpoints(checkpoints)

  const handleRemoveCheckpoint = (id: number, name: string) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Oletko varma että haluat poistaa tämän rastin?")
      if (confirmed) {
        dispatch(removeCheckpointReducer(id, name))
      }
    } else {
      Alert.alert(
        "Vahvista poisto",
        "Oletko varma että haluat poistaa tämän rastin?",
        [
          { text: "Peru", style: "cancel" },
          {
            text: "Poista",
            style: "destructive",
            onPress: () => {
              dispatch(removeCheckpointReducer(id, name))
            }
          }
        ]
      )
    }
  }

  const ItemSeparator = () => <View style={styles.separator} />

  const CheckpointItem = ({ item }: { item: Checkpoint }) => {
    // todo: better translatation tai jotain
    const translatedType = getType(item.type)

    if (pathname === "/settings/checkpoints") {
      return (
        <View style={styles.item}>
          <View style={{ flex: 1 }}>
            <Text style={styles.checkpointName}>
              {item.name}
              {translatedType !== "" && (
                <Text style={styles.checkpointType}> ({translatedType})</Text>
              )}
            </Text>
          </View>
          <Pressable style={styles.smallButton} onPress={() => handleRemoveCheckpoint(item.id, item.name)}>
            <Text style={styles.buttonText}>Poista</Text>
          </Pressable>
        </View>
      )
    }
    return (
      <Link href={`/checkpoints/${item.id}`} asChild>
        <TouchableOpacity style={styles.item}>
          <View style={{ flex: 1 }}>
            <Text style={styles.checkpointName}>
              {item.name}
              {translatedType !== "" && (
                <Text style={styles.checkpointType}> ({translatedType})</Text>
              )}
            </Text>
          </View>
          <Entypo name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
      </Link>
    )
  }

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
