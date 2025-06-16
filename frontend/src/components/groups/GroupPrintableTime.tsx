import { Text } from "react-native"
import { Group, Event } from "@/types"
import { getRaceTime } from "@/utils/timeUtils"

const PrintableTime = ({ group, event }: { group: Group, event: Event }) => {
  const totalMinutes = getRaceTime(group, event)
  if (totalMinutes === null)
    return <Text>-</Text>
  const hours = Math.floor(totalMinutes! / 60)
  const minutes = totalMinutes! % 60
  const time = `${hours}:${minutes.toString().padStart(2, "0")}`

  if (!group.finishTime)
    return <Text style={{ color: "#aaa" }}>{time}</Text>

  return <Text style={{ color: "green", fontWeight: 700 }}>{time}</Text>
}

export default PrintableTime