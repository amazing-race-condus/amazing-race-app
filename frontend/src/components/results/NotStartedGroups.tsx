import { styles } from "@/styles/commonStyles"
import { Event, Group } from "@/types"
import { Link } from "expo-router"
import { Text, TouchableOpacity } from "react-native"
import PrintableTime from "../groups/GroupPrintableTime"

const NotStartedGroups = ({ groups, event }: { groups: Group[], event: Event }) => {
  const notStartedGroups = groups.filter(group => {
    if (!group.nextCheckpointId)
      return false
    if (!group.route[0].id)
      return false
    return group.nextCheckpointId === group.route[0].id
  })

  return (
    <>
      <Text style={styles.header}>Eivät aloittaneet ({notStartedGroups.length})</Text>{notStartedGroups.map((group) =>
        <Link
          key={group.id}
          href={{
            pathname: `/(groups)/group/${group.id}`
          }}
          asChild
        >
          <TouchableOpacity style={styles.item} activeOpacity={0.5}>
            <Text>{group.name}</Text>
            <Text>{PrintableTime({group, event})}</Text>
          </TouchableOpacity>
        </Link>)}
    </>
  )
}

export default NotStartedGroups