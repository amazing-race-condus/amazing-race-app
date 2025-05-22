import React, { useEffect } from "react"
import { View, Text, FlatList, TouchableOpacity } from "react-native"
import { Link, Stack } from "expo-router"
import { useDispatch, useSelector, Provider } from "react-redux"
import store from "@/store/store"
import { styles } from "@/styles/commonStyles"
import { Entypo } from "@expo/vector-icons"
import { fetchCheckpoints } from "@/reducers/checkpointsSlice"
// eslint-disable-next-line no-duplicate-imports
import type { RootState, AppDispatch } from "@/store/store"
import Notification from "@/components/Notification"

const Checkpoints = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const checkpoints = useSelector((state: RootState) => state.checkpoints)

  useEffect(() => {
    dispatch(fetchCheckpoints())
  }, [])

  const CheckpointItem = ({ name, id }: { name: string, id: string }) => (
    <View>
      <Link href={`/checkpoints/${id}`} asChild>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.checkpointName}>{name}</Text>
          <Entypo name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
      </Link>
      {/* <Pressable style={styles.button} onPress={() => handleRemoveCheckpoint(id, name)}>
        <Text style={styles.buttonText}>Poista</Text>
      </Pressable> */}
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
