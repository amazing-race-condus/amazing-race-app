import { useEffect } from "react"
import { Text, View, FlatList, TouchableOpacity, Pressable } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { Link, Stack } from "expo-router"
import { AppDispatch, RootState} from "@/store/store"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/Notification"
import { fetchGroups, removeGroupReducer } from "@/reducers/groupSlice"
import Search from "@/components/Search"
import AddNewButton from "@/components/addGroupButton"

const App = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const groups = useSelector((state: RootState) => state.groups)

  useEffect(() => {
    dispatch(fetchGroups())
  }, [])

  const ItemSeparator = () => <View style={styles.separator} />

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Notification />
      <Search />
      <View style={styles.content}>
        <FlatList
          contentContainerStyle={[styles.listcontainer, { marginTop: "75" }]}
          data={groups}
          ItemSeparatorComponent={ItemSeparator}
          renderItem={({ item }) =>
            <View>
              <Link
                href={{
                  pathname: `/(groups)/${item.id}`,
                  params: { id: item.id, name: item.name }
                }}
                asChild
              >
                <TouchableOpacity style={styles.item}>
                  <Text style={styles.checkpointName}>{item.name}</Text>
                </TouchableOpacity>
              </Link>
              <Pressable onPress={() => dispatch(removeGroupReducer(item.id, item.name))}>
                <Text> delete </Text>
              </Pressable>
            </View>
          }
          keyExtractor={item => item.id}
        />
      </View>
      <AddNewButton/>
    </View>
  )
}

export default App

