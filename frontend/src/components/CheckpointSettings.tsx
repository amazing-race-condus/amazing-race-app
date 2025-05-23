import { View, Text, FlatList, Pressable, Alert, Platform } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { RootState, AppDispatch } from "@/store/store"
import { fetchCheckpoints, removeCheckpointReducer } from "@/reducers/checkpointsSlice"

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

  const CheckpointSettingsItem = ({ name, id }: { name: string, id: string }) => (
    <View style={styles.item}>
      <Text style={styles.checkpointName}>{name}</Text>
      <Pressable style={styles.smallButton} onPress={() => handleRemoveCheckpoint(id, name)}>
        <Text style={styles.buttonText}>Poista</Text>
      </Pressable>
    </View>
  )

  return (
    <View style={styles.content}>
      <Text style={styles.header}>Hallinnoi rasteja:</Text>
      <View style={styles.listcontainer}>
        {checkpoints.map((item, index) => (
          <View key={item.id}>
            <CheckpointSettingsItem name={item.name} id={item.id} />
            {index < checkpoints.length - 1 && <ItemSeparator />}
          </View>
        ))}
      </View>
    </View>
  )
}

export default CheckpointSettings
