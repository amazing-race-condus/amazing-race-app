import { useCallback, useState } from "react"
import { Text, View, FlatList, TouchableOpacity } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { Link, Stack, useFocusEffect } from "expo-router"
import { AppDispatch, RootState} from "@/store/store"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/Notification"
import { fetchGroups } from "@/reducers/groupSlice"
import Search from "@/components/Search"
import AddNewButton from "@/components/addGroupButton"

const App = () => {
  const [search, setSearch] = useState<string>("")

  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const groups = useSelector((state: RootState) => state.groups)

  const filteredGroups = groups.filter(
    item => item.name.toLowerCase().startsWith(search.toLocaleLowerCase())
  )

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchGroups())
    }, [dispatch])
  )

  const ItemSeparator = () => <View style={styles.separator} />

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Notification />
      <Search search={search} setSearch={setSearch}/>
      <View style={styles.content}>
        <FlatList
          contentContainerStyle={[styles.listcontainer]}
          data={filteredGroups}
          ItemSeparatorComponent={ItemSeparator}
          renderItem={({ item }) =>
            <View>
              <Link
                href={{
                  pathname: `/(groups)/group/${item.id}`,
                }}
                asChild
              >
                <TouchableOpacity style={styles.item}>
                  <Text style={styles.checkpointName}>{item.name}</Text>
                </TouchableOpacity>
              </Link>
            </View>
          }
          keyExtractor={item => item.id?.toString() ?? ""}
        />
      </View>
      <AddNewButton/>
    </View>
  )
}

export default App
