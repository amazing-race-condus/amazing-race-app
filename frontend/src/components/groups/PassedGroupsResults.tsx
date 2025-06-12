import { View, Text, Pressable } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { Link } from "expo-router"
import { sortByTime } from "@/utils/groupUtils"
import { useState } from "react"
import Filter from "../ui/Filter"
import PrintableTime from "./GroupPrintableTime"

const PassedGroupsResults = () => {
  const event = useSelector((state: RootState) => state.event)
  const gameStarted = Boolean(event.startTime)
  const gameFinished = Boolean(event.endTime)
  const [filterOrder, setFilterOrder] = useState<number>(0)

  let groups = useSelector((state: RootState) => state.groups)
  groups = sortByTime([...groups], event)

  const passedGroups = groups.filter(group => group.finishTime && group.easy === (filterOrder === 1))
  const unPassedGroups = groups.filter(group => !group.finishTime && group.easy === (filterOrder === 1))

  return (
    <View>
      <Text style={styles.title}>Tulokset</Text>
      {!gameStarted && <Text style={styles.breadText}>Peliä ei ole aloitettu.</Text>}
      {(gameStarted && !gameFinished) && <Text style={styles.breadText}>Peli on käynnissä.</Text>}
      {gameFinished && <Text style={styles.breadText}>Peli on päättynyt.</Text>}
      <Filter order={filterOrder} setOrder={setFilterOrder} values={["Tavalliset", "Helpotetut"]} />
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
            <Text style={{ color: "gray" }}>{PrintableTime({group, event})}</Text>
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
            <Text style={{ color: "gray" }}>{PrintableTime({group, event})}</Text>
          </Pressable>
        </Link>)}

    </View>
  )
}

export default PassedGroupsResults
