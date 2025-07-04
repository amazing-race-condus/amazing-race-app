import { styles } from "@/styles/commonStyles"
import { Event, Group } from "@/types"
import { Link } from "expo-router"
import { Text, TouchableOpacity } from "react-native"
import PrintableTime from "../groups/GroupPrintableTime"

const PlayingGroups = ({ groups, event }: { groups: Group[], event: Event }) => {
  const startedGroups = groups.filter(group => {
    if (group.nextCheckpointId && group.route) {
      return group.nextCheckpointId !== group.route[0].id
    } else {
      return false
    }
  })
  const playingGroups = startedGroups.filter(group => !group.finishTime && !group.dnf && !group.disqualified)

  return (
    <>
      <Text style={styles.header}>Peli kesken ({playingGroups.length})</Text>{playingGroups.map((group) =>
        <Link
          key={group.id}
          href={{
            pathname: `/(groups)/group/${group.id}`
          }}
          asChild
        >
          <TouchableOpacity style={styles.item} activeOpacity={0.5}>
            <Text>{group.name}</Text>
            <Text style={{ color: "gray" }}>{PrintableTime({group, event})}</Text>
          </TouchableOpacity>
        </Link>)}
    </>
  )
}

export default PlayingGroups
