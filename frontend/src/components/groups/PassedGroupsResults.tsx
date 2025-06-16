import { View, Text, Pressable } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { Link } from "expo-router"
import { sortByTime } from "@/utils/groupUtils"
import { useState } from "react"
import Filter from "../ui/Filter"
import PrintableTime from "./GroupPrintableTime"
import { Group, Event } from "@/types"

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

const PlayingGroups = ({ groups, event }: { groups: Group[], event: Event }) => {
  const playingGroups = groups.filter(group => !group.finishTime && !group.dnf && !group.disqualified)

  return (
    <>
      <Text style={styles.header}>Pelissä ({playingGroups.length})</Text>{playingGroups.map((group) =>
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
    </>
  )
}

const DnfGroups = ({ groups, event }: { groups: Group[], event: Event }) => {
  const dnfGroups = groups.filter(group => group.dnf)

  return (
    <>
      <Text style={styles.header}>Keskeyttäneet ({dnfGroups.length})</Text>{dnfGroups.map((group) =>
        <Link
          key={group.id}
          href={{
            pathname: `/(groups)/group/${group.id}`
          }}
          asChild
        >
          <Pressable style={styles.item}>
            <Text style={{ color: "maroon" }}>{group.name}</Text>
            <Text style={{ color: "gray" }}>{PrintableTime({group, event})}</Text>
          </Pressable>
        </Link>)}
    </>
  )
}

const DisqualifiedGroups = ({ groups, event }: { groups: Group[], event: Event }) => {
  const disqualifiedGroups = groups.filter(group => group.disqualified)

  return (
    <>
      <Text style={styles.header}>Diskatut ({disqualifiedGroups.length})</Text>{disqualifiedGroups.map((group) =>
        <Link
          key={group.id}
          href={{
            pathname: `/(groups)/group/${group.id}`
          }}
          asChild
        >
          <Pressable style={styles.item}>
            <Text style={{ color: "maroon" }}>{group.name}</Text>
            <Text style={{ color: "gray" }}>{PrintableTime({group, event})}</Text>
          </Pressable>
        </Link>)}
    </>
  )
}

const NotStartedGroups = ({ groups, event }: { groups: Group[], event: Event }) => {
  const notStartedGroups = groups.filter(group => {
    if (!group.nextCheckpointId)
      return false
    if (!group.route[0].id)
      return false
    return group.nextCheckpointId !== group.route[0].id
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
          <Pressable style={styles.item}>
            <Text>{group.name}</Text>
            <Text>{PrintableTime({group, event})}</Text>
          </Pressable>
        </Link>)}
    </>
  )
}

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
