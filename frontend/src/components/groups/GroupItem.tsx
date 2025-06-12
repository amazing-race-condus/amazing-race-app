import { View, Text, Pressable, TouchableOpacity, StyleSheet } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
import { usePathname, Link } from "expo-router"
import { Entypo, FontAwesome } from "@expo/vector-icons"
import { removeGroupReducer } from "@/reducers/groupSlice"
import { handleAlert } from "@/utils/handleAlert"
import { Event, Group } from "@/types"
import { getRaceTime } from "@/utils/timeUtils"

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

  const dns = group?.nextCheckpointId === group?.route[0]?.id

  const getGroupStatus = (group: Group): { label: string; color: string } | null => {
    if (group.disqualified) return { label: "DSQ", color: "purple" }
    if (dns) return { label: "DNS", color: "orange" }
    if (group.dnf) return { label: "DNF", color: "red" }
    if (group.finishTime) return { label: "FIN", color: "green" }
    return null
  }

  const StatusBadge = ({ label, color }: { label: string; color: string }) => (
    <View style={[localStyles.badge, { backgroundColor: color }]}>
      {label === "FIN" ? (
        <FontAwesome name="flag-checkered" size={12} color="white" />
      ) : null }
      <Text style={localStyles.badgeText}>{label}</Text>
    </View>
  )

  const PrintableTime = (group: Group, event: Event) => {
    const totalMinutes = getRaceTime(group, event)
    const hours = Math.floor(totalMinutes! / 60)
    const minutes = totalMinutes! % 60
    const time = `${hours}:${minutes.toString().padStart(2, "0")}`

    if (!time)
      return <Text>-</Text>

    if (!group.finishTime)
      return <Text style={{ color: "#aaa" }}>{time}</Text>

    return <Text style={{ color: "green", fontWeight: 700 }}>{time}</Text>
  }

  const status = getGroupStatus(group)

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
        <View style={{flexDirection: "row"}}>
          {status && (
            <View style={{ marginRight: 8 }}>
              <StatusBadge label={status.label} color={status.color} />
            </View>
          )}
          <View style={{ marginRight: 8 }}>
            {PrintableTime(group, event)}
          </View>
          <Entypo name="chevron-right" size={24} color="black" />
        </View>
      </TouchableOpacity>
    </Link>
  )
}

const localStyles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
})

export default GroupItem
