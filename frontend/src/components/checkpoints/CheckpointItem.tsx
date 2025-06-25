import { removeCheckpointReducer } from "@/reducers/checkpointsSlice"
import { AppDispatch } from "@/store/store"
import { styles } from "@/styles/commonStyles"
import { Checkpoint } from "@/types"
import { getType } from "@/utils/checkpointUtils"
import { handleAlert } from "@/utils/handleAlert"
import { Link, usePathname } from "expo-router"
import React from "react"
import { View, Pressable, TouchableOpacity, Text } from "react-native"
import { useDispatch } from "react-redux"
import { Entypo } from "@expo/vector-icons"

const CheckpointItem = ({ item, onEditCheckpoint }: { item: Checkpoint, onEditCheckpoint?: (checkpoint: Checkpoint) => void }) => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const translatedType = getType(item.type)
  const pathname = usePathname()

  const handleRemoveCheckpoint = (id: number, name: string) => {
    handleAlert({
      confirmText: "Poista",
      title: "Vahvista poisto",
      message: "Oletko varma että haluat poistaa tämän rastin?",
      onConfirm: () => dispatch(removeCheckpointReducer(id, name))
    })
  }

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
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
            <Pressable style={({ pressed }) => [styles.button2, {flex: 1, opacity: pressed ? 0.5 : 1 }]} onPress={() => handleRemoveCheckpoint(item.id, item.name)}>
              <Text style={styles.buttonText}>Poista</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.button2, {flex: 1, marginLeft: 8, opacity: pressed ? 0.5 : 1 }]} onPress={() => onEditCheckpoint?.(item)}>
              <Text style={styles.buttonText}>Muokkaa</Text>
            </Pressable>
          </View>
        </View>
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

export default CheckpointItem
