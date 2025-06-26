import { styles } from "@/styles/commonStyles"
import { Event, Group } from "@/types"
import { Link } from "expo-router"
import { Text, TouchableOpacity } from "react-native"
import PrintableTime from "../groups/GroupPrintableTime"

const DisqualifiedGroups = ({ groups, event }: { groups: Group[], event: Event }) => {
  const disqualifiedGroups = groups.filter(group => group.disqualified)

  return (
    <>
      {disqualifiedGroups.length > 0 &&
        <>
          <Text style={styles.header}>Diskatut ({disqualifiedGroups.length})</Text>{disqualifiedGroups.map((group) =>
            <Link
              key={group.id}
              href={{
                pathname: `/(groups)/group/${group.id}`
              }}
              asChild
            >
              <TouchableOpacity style={styles.item} activeOpacity={0.5}>
                <Text style={{ color: "maroon" }}>{group.name}</Text>
                <Text style={{ color: "gray" }}>{PrintableTime({group, event})}</Text>
              </TouchableOpacity>
            </Link>)}
        </>
      }
    </>
  )
}

export default DisqualifiedGroups