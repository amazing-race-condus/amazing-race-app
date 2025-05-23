import React, { useEffect } from "react"
import { Text, View, FlatList, TouchableOpacity } from "react-native"
import { Provider, useDispatch, useSelector } from "react-redux"
import { Link, Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import store, { AppDispatch, RootState} from "@/store/store"
import Notification from "@/components/Notification"
import { fetchGroups } from "@/reducers/groupSlice"

const App = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const groups = useSelector((state: RootState) => state.groups)

  useEffect(() => {
    dispatch(fetchGroups())
  }, [])

  const ItemSeparator = () => <View style={styles.separator} />

  const CheckpointItem = ({ name, id }: { name: string, id: string }) => (
    <View>
      <Link href={`/checkpoints/${id}`} asChild>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.checkpointName}>{name}</Text>
          {/* <Entypo name="chevron-right" size={24} color="black" /> */}
        </TouchableOpacity>
      </Link>
      {/* <Text style={styles.checkpointName}>{name}</Text> */}
      {/* <Pressable style={styles.button} onPress={() => handleRemoveCheckpoint(id, name)}>
        <Text style={styles.buttonText}>Poista</Text>
      </Pressable> */}
    </View>
  )

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Notification />
      <View style={styles.content}>
        <Text style={styles.title}>Ryhmät</Text>

        <FlatList
          contentContainerStyle={styles.listcontainer}
          data={groups}
          ItemSeparatorComponent={ItemSeparator}
          renderItem={({ item }) =>
            // eslint-disable-next-line react/jsx-no-undef
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

const AppProvider = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

export default AppProvider
