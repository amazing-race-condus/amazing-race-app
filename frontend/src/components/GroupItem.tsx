import { View, Text, Pressable, Alert, Platform, TouchableOpacity } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { usePathname, Link } from "expo-router"
import { Entypo } from "@expo/vector-icons"
import { removeGroupReducer } from "@/reducers/groupSlice"

const GroupItem = ({ name, members, id }: { name: string; members: number; id: string }) => {
  const dispatch: AppDispatch = useDispatch()
  const pathname = usePathname()

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

  if (pathname ==="/settings/groups") {
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

export default GroupItem
