import { View, Text, FlatList, Pressable, Alert } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useDispatch, useSelector, Provider } from "react-redux"
import { useEffect } from "react"
import store, { RootState, AppDispatch } from "@/store/store"
import { fetchCheckpoints, removeCheckpointReducer } from "@/reducers/checkpointsSlice"

const CheckpointSettings = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const checkpoints = useSelector((state: RootState) => state.checkpoints)

  useEffect(() => {
    dispatch(fetchCheckpoints())
  }, [])

  const handleRemoveCheckpoint = (id: string, name: string) => {
    Alert.alert(
      "Vahvista poisto",
      "Oletko varma että haluat poistaa tämän rastin?",
      [
        { text: "Peru", style: "cancel" },
        { text: "Poista", style: "destructive", onPress: () => {
          dispatch(removeCheckpointReducer(id, name))
        }
        }]
    )
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
      <Text style={styles.header}>Rastit:</Text>
      <FlatList
        contentContainerStyle={styles.listcontainer}
        data={checkpoints}
        ItemSeparatorComponent={ItemSeparator}
        renderItem={({ item }) =>
          <CheckpointSettingsItem
            name={item.name}
            id={item.id}
          />
        }
        keyExtractor={item => item.id}
      />
    </View>
  )
}

const CheckpointSettingsProvider = () => (
  <Provider store={store}>
    <CheckpointSettings />
  </Provider>
)

export default CheckpointSettingsProvider
