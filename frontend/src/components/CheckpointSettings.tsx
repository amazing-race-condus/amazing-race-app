import { View, Text, Pressable, Alert, Platform } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { RootState, AppDispatch } from "@/store/store"
import { fetchCheckpoints, removeCheckpointReducer } from "@/reducers/checkpointsSlice"
import { getType } from "@/utils/typeUtils"

const CheckpointSettings = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const checkpoints = useSelector((state: RootState) => state.checkpoints)

  useEffect(() => {
    dispatch(fetchCheckpoints())
  }, [])

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

  const CheckpointSettingsItem = ({ name, type, id }: { name: string, type: string, id: string }) => {
    const translatedType = getType(type)
    return (

      <View style={styles.item}>
        <Text style={styles.checkpointName}>
          {name}
          {translatedType !== "" && (
            <Text style={styles.checkpointType}> ({translatedType})</Text>
          )}
        </Text>
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
        {checkpoints.map((item, index) => (
          <View key={item.id}>
            <CheckpointSettingsItem name={item.name} type={item.type} id={item.id} />
            {index < checkpoints.length - 1 && <ItemSeparator />}
          </View>
        ))}
      </View>
    </View>
  )
}

export default CheckpointSettings
