import { styles } from "@/styles/commonStyles"
import { Event, Group } from "@/types"
import { Link } from "expo-router"
import { Text, TouchableOpacity } from "react-native"
import PrintableTime from "../groups/GroupPrintableTime"

const DnfGroups = ({ groups, event }: { groups: Group[], event: Event }) => {
  const dnfGroups = groups.filter(group => group.dnf)

  return (
    <>
      {dnfGroups.length >0 &&
        <>
          <Text style={styles.header}>Keskeyttäneet ({dnfGroups.length})</Text>{dnfGroups.map((group) =>
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

export default DnfGroups
