import { View, Text, Pressable, TouchableOpacity } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { usePathname, Link } from "expo-router"
import { Entypo } from "@expo/vector-icons"
import { removeGroupReducer } from "@/reducers/groupSlice"
import { handleAlert } from "@/utils/handleAlert"

const GroupItem = ({ name, members, id }: { name: string; members: number; id: string }) => {
  const dispatch: AppDispatch = useDispatch()
  const pathname = usePathname()

  const handleRemoveGroup = (id: number) => {
    handleAlert({
      confirmText: "Poista",
      title: "Vahvista poisto",
      message: "Oletko varma että haluat poistaa tämän ryhmän?",
      onConfirm: () => dispatch(removeGroupReducer(id))
    })
  }

  if (pathname ==="/settings/groups") {
    return (
      <View style={styles.item}>
        <View style={{ flex: 1 }}>
          <Text style={styles.checkpointName}>{name}</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
            <Pressable style={[ styles.button2, { flex: 1 } ]} onPress={() => handleRemoveGroup(Number(id))}>
              <Text style={styles.buttonText}>Poista</Text>
            </Pressable>
            <Pressable style={[styles.button2, { flex:1, marginLeft: 8 }]} onPress={() => console.log("muokataan")}>
              <Text style={styles.buttonText}>Muokkaa</Text>
            </Pressable>
          </View>
        </View>
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

export default GroupItem
