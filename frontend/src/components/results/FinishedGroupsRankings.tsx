import { styles } from "@/styles/commonStyles"
import { Event, Group } from "@/types"
import { Link } from "expo-router"
import { Pressable, Text } from "react-native"
import PrintableTime from "../groups/GroupPrintableTime"

const FinishedGroupsRankings = ({ groups, event }: { groups: Group[], event: Event }) => {
  const finishedGroups = groups.filter(group => group.finishTime && group.nextCheckpointId === null && !group.dnf && !group.disqualified)

  return (
    <>
      <Text style={styles.header}>Maaliin tulleet ({finishedGroups.length})</Text>{finishedGroups.map((group, i) =>
        <Link
          key={group.id}
          href={{
            pathname: `/(groups)/group/${group.id}`
          }}
          asChild
        >
          <Pressable style={styles.item}>
            <Text>{i+1}.</Text>
            <Text>{group.name}</Text>
            <Text>{PrintableTime({group, event})}</Text>
          </Pressable>
        </Link>)}
    </>
  )
}

export default FinishedGroupsRankings
