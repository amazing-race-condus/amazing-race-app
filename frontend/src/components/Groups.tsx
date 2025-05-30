import { View, Text, Pressable, Alert, Platform, TouchableOpacity, FlatList } from "react-native"
import { useCallback, useState } from "react"
import { styles } from "@/styles/commonStyles"
import { useDispatch, useSelector } from "react-redux"
import { RootState, AppDispatch } from "@/store/store"
import { usePathname, Link, useFocusEffect } from "expo-router"
import { Entypo } from "@expo/vector-icons"
import { removeGroupReducer, fetchGroups } from "@/reducers/groupSlice"
import Search from "@/components/Search"

const Groups = () => {
  const [search, setSearch] = useState<string>("")
  const dispatch: AppDispatch = useDispatch()
  const groups = useSelector((state: RootState) => state.groups)
  const pathname = usePathname()

  const filteredGroups = groups.filter(item =>
    item.name.toLowerCase().startsWith(search.toLowerCase())
  )

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchGroups())
    }, [dispatch])
  )

  const handleRemoveGroup = (id: string | number, name: string) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Oletko varma että haluat poistaa tämän ryhmän?")
      if (confirmed) {
        dispatch(removeGroupReducer(Number(id)))
      }
    } else {
      Alert.alert(
        "Vahvista poisto",
        "Oletko varma että haluat poistaa tämän ryhmän?",
        [
          { text: "Peru", style: "cancel" },
          {
            text: "Poista",
            style: "destructive",
            onPress: () => {
              dispatch(removeGroupReducer(Number(id)))
            }
          }
        ]
      )
    }
  }

  const GroupItem = ({ name, members, id }: { name: string; members: number; id: string }) => {
    if (pathname === "/settings/groups") {
      return (
        <View style={styles.item}>
          <View style={{ flex: 1 }}>
            <Text style={styles.checkpointName}>{name}</Text>
          </View>
          <Pressable style={styles.smallButton} onPress={() => handleRemoveGroup(id, name)}>
            <Text style={styles.buttonText}>Poista</Text>
          </Pressable>
        </View>
      )
    }

    return (
      <Link
        href={{
          pathname: `/(groups)/group/${id}`,
          params: { name, members }
        }}
        asChild
      >
        <TouchableOpacity style={styles.item}>
          <Text style={styles.checkpointName}>{name}</Text>
          <Entypo name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
      </Link>
    )
  }

  const ItemSeparator = () => <View style={styles.separator} />

  return (
    <View style={styles.container}>
      {pathname === "/" && (
        <Text style={styles.title}>Ryhmät:</Text>
      )}
      {pathname.startsWith("/settings") && (
        <Text style={styles.header}>Hallinnoi ryhmiä:</Text>
      )}
      <Search search={search} setSearch={setSearch} />
      <View style={styles.content}>
        <FlatList
          contentContainerStyle={[styles.listcontainer]}
          data={filteredGroups}
          ItemSeparatorComponent={ItemSeparator}
          renderItem={({ item }) => (
            <GroupItem
              name={item.name}
              members={item.members}
              id={item.id.toString()}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
  )
}

export default Groups
