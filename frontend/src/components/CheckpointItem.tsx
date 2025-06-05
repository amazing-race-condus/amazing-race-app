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

const CheckpointItem = ({ item }: { item: Checkpoint }) => {
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

export default CheckpointItem
