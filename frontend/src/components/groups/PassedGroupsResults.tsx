import { View, Text, Pressable } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { Link } from "expo-router"
import { getRaceTime } from "@/utils/timeUtils"
import { Group, Event } from "@/types"
import { sortByTime } from "@/utils/groupUtils"

const PassedGroupsResults = () => {
  const event = useSelector((state: RootState) => state.event)
  const gameStarted = Boolean(event.startTime)
  const gameFinished = Boolean(event.endTime)

  let groups = useSelector((state: RootState) => state.groups)
  groups = sortByTime([...groups], event)

  const passedGroups = groups.filter(group => group.finishTime)
  const unPassedGroups = groups.filter(group => !group.finishTime)

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

  return (
    <View>
      <Text style={styles.title}>Tulokset</Text>
      {!gameStarted && <Text style={styles.breadText}>Peliä ei ole aloitettu.</Text>}
      {(gameStarted && !gameFinished) && <Text style={styles.breadText}>Peli on käynnissä.</Text>}
      {gameFinished && <Text style={styles.breadText}>Peli on päättynyt.</Text>}
      {passedGroups.map((group, i)=>
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
            <Text style={{ color: "gray" }}>{PrintableTime(group, event)}</Text>
          </Pressable>
        </Link>)}
      {unPassedGroups.map((group, i)=>
        <Link
          key={group.id}
          href={{
            pathname: `/(groups)/group/${group.id}`
          }}
          asChild
        >
          <Pressable style={styles.item}>
            <Text>{group.name}</Text>
            <Text style={{ color: "gray" }}>{PrintableTime(group, event)}</Text>
          </Pressable>
        </Link>)}

    </View>
  )
}

export default PassedGroupsResults
