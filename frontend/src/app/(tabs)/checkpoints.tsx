import React, { useEffect } from "react"
import { View, Text, FlatList, Pressable, Alert } from "react-native"
import { Link, Stack } from "expo-router"
import { useDispatch, useSelector, Provider } from "react-redux"
import store from "@/store/store"
import { styles } from "@/styles/commonStyles"
import { fetchCheckpoints, removeCheckpointReducer } from "@/reducers/checkpointsSlice"
// eslint-disable-next-line no-duplicate-imports
import type { RootState, AppDispatch } from "@/store/store"
import Notification from "@/components/Notification"
import { setNotification } from "@/reducers/responseSlice"

const Checkpoints = () => {
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

  const CheckpointItem = ({ name, id }: { name: string, id: string }) => (
    <View style={styles.item}>
      <Link style={styles.checkpointName} href={`/checkpoints/${id}`}>{name}</Link>
      <Pressable style={styles.button} onPress={() => handleRemoveCheckpoint(id, name)}>
        <Text style={styles.buttonText}>Poista</Text>
      </Pressable>
    </View>
  )

  const ItemSeparator = () => <View style={styles.separator} />

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Stack.Screen options={{ headerShown: false }} />
        <Notification />
        <Text style={styles.title}>Rastit:</Text>
        <FlatList
          contentContainerStyle={styles.listcontainer}
          data={checkpoints}
          ItemSeparatorComponent={ItemSeparator}
          renderItem={({ item }) =>
            <CheckpointItem
              name={item.name}
              id={item.id}
            />
          }
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  )
}

const CheckpointProvider = () => (
  <Provider store={store}>
    <Checkpoints />
  </Provider>
)

export default CheckpointProvider
