import { View, Text, Pressable, Alert, Platform, TouchableOpacity, FlatList } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { RootState, AppDispatch } from "@/store/store"
import { fetchCheckpoints, removeCheckpointReducer } from "@/reducers/checkpointsSlice"
import { getType, sortCheckpoints } from "@/utils/checkpointUtils"
import { usePathname, Link } from "expo-router"
import { Entypo } from "@expo/vector-icons"

const Checkpoints = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const checkpoints = useSelector((state: RootState) => state.checkpoints)
  const pathname = usePathname()

  useEffect(() => {
    dispatch(fetchCheckpoints())
  }, [])

  const sortedCheckpoints = sortCheckpoints(checkpoints)

  const handleRemoveCheckpoint = (id: string, name: string) => {
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

  const CheckpointItem = ({ name, type, id }: { name: string, type: string, id: string }) => {
    const translatedType = getType(type)

    if (pathname.startsWith("/checkpoints")) {
      return (
        <Link href={`/checkpoints/${id}`} asChild>
          <TouchableOpacity style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.checkpointName}>
                {name}
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
      <View style={styles.item}>
        <View style={{ flex: 1 }}>
          <Text style={styles.checkpointName}>
            {name}
            {translatedType !== "" && (
              <Text style={styles.checkpointType}> ({translatedType})</Text>
            )}
          </Text>
        </View>
        <Pressable style={styles.smallButton} onPress={() => handleRemoveCheckpoint(id, name)}>
          <Text style={styles.buttonText}>Poista</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.content}>
      <Text style={styles.header}>Hallinnoi rasteja:</Text>
      <View style={styles.listcontainer}>
        {sortedCheckpoints.map((item, index) => (
          <View key={item.id}>
            <CheckpointItem name={item.name} type={item.type} id={item.id} />
            {index < sortedCheckpoints.length - 1 && <ItemSeparator />}
          </View>
        ))}
      </View>
    </View>
  )
}

export default Checkpoints
