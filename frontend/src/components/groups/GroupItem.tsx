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
        </View>
        <Pressable style={styles.smallButton} onPress={() => handleRemoveGroup(Number(id))}>
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

export default GroupItem
