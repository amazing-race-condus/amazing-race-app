import React, { useEffect } from 'react'
import { View, Text, FlatList, Pressable} from "react-native"
import { useDispatch, useSelector, Provider } from 'react-redux'
import store from '@/store/store'
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import { fetchCheckpoints, removeCheckpointReducer } from '@/reducers/checkpointsSlice'
// eslint-disable-next-line no-duplicate-imports
import type { RootState, AppDispatch } from '@/store/store'

const Checkpoints = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const checkpoints = useSelector((state: RootState) => state.checkpoints)

  useEffect(() => {
    dispatch(fetchCheckpoints())
  }, [])


  const CheckpointItem = ({ name, id }: { name: string, id: string }) => (
    <View style={styles.item}>
      <Text style={styles.checkpointName}>{name}</Text>
      <Pressable style={styles.button} onPress={() => { dispatch(removeCheckpointReducer(id)) }}>
        <Text style={styles.buttonText}>Poista</Text>
      </Pressable>
    </View>
  )

  const ItemSeparator = () => <View style={styles.separator} />

  return (
    <View style={styles.content}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppBar pageTitle='Rastit' />
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
  )
}

const CheckpointProvider = () => (
  <Provider store={store}>
    <Checkpoints />
  </Provider>
)

export default CheckpointProvider
