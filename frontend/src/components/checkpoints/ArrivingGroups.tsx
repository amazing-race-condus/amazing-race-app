import { View, Text } from "react-native"
import { useState } from "react"
import { styles } from "@/styles/commonStyles"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import GroupList from "../groups/GroupList"
import Search from "@/components/ui/Search"
import { Group } from "@/types"
import Filter from "../ui/Filter"

const routeCheckpointIds = (group: Group) => {
  return group.route.map(route => Number(route.id))
}

const laterCheckpointIds = (group: Group) => {
  if (group.nextCheckpointId === null)
    return []
  const allRouteCheckpointIds = routeCheckpointIds(group)
  return allRouteCheckpointIds.slice(allRouteCheckpointIds.indexOf(group.nextCheckpointId)+1, allRouteCheckpointIds.length)
}

const groupsCheckpointStatus = (group: Group, checkpointId: number) => {
  if (!group.route) {
    return "no route"
  }
  if (!(routeCheckpointIds(group).includes(checkpointId))) {
    return "never"
  }
  if (checkpointId === group.nextCheckpointId) {
    return "next"
  }
  if (laterCheckpointIds(group).includes(checkpointId)) {
    return "later"
  }
  return "visited"
}

const NoGroups = () => <Text style={[styles.breadText, {marginVertical: 10, textAlign: "center"}]}>Ei ryhmiä.</Text>

const NextGroups = ({ groups, checkpointId }: { groups: Group[], checkpointId: number}) => {
  const nextGroups = groups.filter(group => groupsCheckpointStatus(group, checkpointId) === "next" && !group.disqualified && !group.dnf)
  if (nextGroups.length === 0)
    return <NoGroups />
  return <GroupList groups={nextGroups} />
}

const LaterGroups = ({ groups, checkpointId }: { groups: Group[], checkpointId: number}) => {
  const laterGroups = groups.filter(group => groupsCheckpointStatus(group, checkpointId) === "later" && !group.disqualified && !group.dnf)
  if (laterGroups.length === 0)
    return <NoGroups />
  return <GroupList groups={laterGroups} />
}

const WrongGroups = ({ groups, checkpointId }: { groups: Group[], checkpointId: number}) => {
  const wrongGroups = groups.filter(group => groupsCheckpointStatus(group, checkpointId) === "never")
  if (wrongGroups.length === 0)
    return <NoGroups />
  return <GroupList groups={wrongGroups} />
}

const ArrivingGroups = ({ checkpointId }: { checkpointId: number}) => {
  const [search, setSearch] = useState<string>("")
  const [order, setOrder] = useState<number>(0)
  const groups = useSelector((state: RootState) => state.groups)

  const filteredGroups = groups.filter(item =>
    item.name.toLowerCase().startsWith(search.toLowerCase())
  )

  return (
    <View style={styles.container}>
      <Search search={search} setSearch={setSearch} placeHolder="Hae kaikista ryhmistä..." />
      {search.length > 0
        ? <>
          {filteredGroups.length === 0 && <Text style={[styles.breadText, {textAlign: "center"}]}>Ei hakutuloksia.</Text>}
          <GroupList groups={filteredGroups} />
        </>
        :
        <>
          <Filter order={order} setOrder={setOrder} values={["Seuraavaksi saapuvat", "Myöhemmin saapuvat", "Ei reitillä"]}/>
          { order === 0 && <NextGroups groups={groups} checkpointId={checkpointId} /> }
          { order === 1 && <LaterGroups groups={groups} checkpointId={checkpointId} /> }
          { order === 2 && <WrongGroups groups={groups} checkpointId={checkpointId} /> }
        </>
      }
    </View>
  )

}

export default ArrivingGroups
