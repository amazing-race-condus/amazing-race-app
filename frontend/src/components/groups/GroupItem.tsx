import { View, Text, Pressable, TouchableOpacity  } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
import { usePathname, Link } from "expo-router"
import { Entypo } from "@expo/vector-icons"
import { removeGroupReducer } from "@/reducers/groupSlice"
import { handleAlert } from "@/utils/handleAlert"
import { Event, Group } from "@/types"
import StatusBadge from "./GroupStatusBadge"
import PrintableTime from "./GroupPrintableTime"

const GroupItem = ({ group, onEditGroup }: { group: Group, onEditGroup?: (group: Group) => void }) => {
  const event: Event = useSelector((state: RootState) => state.event)
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
          <Text
            style={styles.checkpointName}
          >{group.name}</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
            <Pressable style={[ styles.button2, { flex: 1 } ]} onPress={() => handleRemoveGroup(Number(group.id))}>
              <Text style={styles.buttonText}>Poista</Text>
            </Pressable>
            <Pressable style={[styles.button2, { flex:1, marginLeft: 8 }]} onPress={() => onEditGroup?.(group)}>
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
        pathname: `/(groups)/group/${group.id}`
      }}
      asChild
    >
      <TouchableOpacity style={styles.item}>
        <Text style={[styles.checkpointName,
          { maxWidth: "55%" }
        ]}>{group.name}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ marginRight: 8 }}>
            <StatusBadge
              group={group}
            />
          </View>
          <View style={{ marginRight: 8, minWidth: 40, alignItems: "flex-end" }}>
            <PrintableTime
              group={group}
              event={event}
            />
          </View>
          <Entypo name="chevron-right" size={24} color="black" />
        </View>
      </TouchableOpacity>
    </Link>
  )
}

export default GroupItem
