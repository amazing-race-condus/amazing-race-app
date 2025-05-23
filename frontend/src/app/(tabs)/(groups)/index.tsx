import { useState, useEffect } from "react"
import { Text, View, FlatList, TouchableOpacity, TextInput, Pressable } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { Link, Stack } from "expo-router"
import { AppDispatch, RootState} from "@/store/store"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/Notification"
import { fetchGroups, addGroupReducer, removeGroupReducer } from "@/reducers/groupSlice"
import Entypo from "@expo/vector-icons/Entypo"
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import Search from "@/components/Search"
import { getGroup } from "@/services/groupService"

const AddNewButton = () => {
  return (
    <Pressable
      onPress={() => console.log("opened")}
      style={{
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "orange",
        width: 56,
        height: 56,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FontAwesome6 name="plus" size={24} color="white" />
    </Pressable>
  )
}

const AddNew = ({ text, onChangeText }) => {
  return (
    <TextInput
      onChangeText={onChangeText}
      value={text}
    />
  )
}

const App = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const groups = useSelector((state: RootState) => state.groups)

  const [text, setText] = useState("")

  useEffect(() => {
    dispatch(fetchGroups())
  }, [])

  const ItemSeparator = () => <View style={styles.separator} />

  const checkpointCreation = async () => {
    const newCheckpoint = {
      name: text,
      id: "0"
    }
    dispatch(addGroupReducer(newCheckpoint, text))
    setText("")

  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <AddNew text={text} onChangeText={setText} />
      <Pressable onPress={() => checkpointCreation()}>
        <Text> testing</Text>
      </Pressable>
      <Notification />
      {/* <Search /> */}
      <View style={styles.content}>
        <FlatList
          contentContainerStyle={styles.listcontainer}
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
                <Text> teting </Text>
              </Pressable>
            </View>
          }
          keyExtractor={item => item.id}
        />
      </View>
      <AddNewButton />
    </View>
  )
}

export default App

