import { View, Text } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { sortByTime } from "@/utils/groupUtils"
import { useState } from "react"
import Filter from "../ui/Filter"
import FinishedGroupsRankings from "./FinishedGroupsRankings"
import PlayingGroups from "./PlayingGroups"
import DnfGroups from "./DnfGroups"
import DisqualifiedGroups from "./DisqualifiedGroups"
import NotStartedGroups from "./NotStartedGroups"
import ExportResults from "./ExportResults"

const PassedGroupsResults = () => {
  const event = useSelector((state: RootState) => state.event)
  const gameStarted = Boolean(event.startTime)
  const gameFinished = Boolean(event.endTime)
  const [filterOrder, setFilterOrder] = useState<number>(0)

  let groups = useSelector((state: RootState) => state.groups)
  groups = sortByTime([...groups], event)

  const normalGroups = groups.filter(group => !group.easy)
  const easyGroups = groups.filter(group => group.easy)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tulokset</Text>

      {!gameStarted && <Text style={styles.breadText}>Peliä ei ole aloitettu.</Text>}
      {(gameStarted && !gameFinished) && <Text style={styles.breadText}>Peli on käynnissä.</Text>}
      {gameFinished && <Text style={styles.breadText}>Peli on päättynyt.</Text>}

      <ExportResults />

      <Filter order={filterOrder} setOrder={setFilterOrder} values={["Tavalliset", "Helpotetut"]} />

      {filterOrder === 0
        ? <>
          <FinishedGroupsRankings groups={normalGroups} event={event} />
          <PlayingGroups groups={normalGroups} event={event} />
          <DnfGroups groups={normalGroups} event={event} />
          <DisqualifiedGroups groups={normalGroups} event={event} />
          <NotStartedGroups groups={normalGroups} event={event} />
        </>
        : <>
          <FinishedGroupsRankings groups={easyGroups} event={event} />
          <PlayingGroups groups={easyGroups} event={event} />
          <DnfGroups groups={easyGroups} event={event}  />
          <DisqualifiedGroups groups={easyGroups} event={event}  />
          <NotStartedGroups groups={easyGroups} event={event}  />
        </>
      }

    </View>
  )
}

export default PassedGroupsResults
