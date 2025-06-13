import { View, Text } from "react-native"
import { useState } from "react"
import { styles } from "@/styles/commonStyles"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import GroupList from "../groups/GroupList"
import Search from "@/components/ui/Search"
import { Group } from "@/types"
import Filter from "../ui/Filter"

const NextGroups = ({ groups, checkpointId }: { groups: Group[], checkpointId: number}) => {
  const nextGroups = groups.filter(group => group.nextCheckpointId === checkpointId && !group.disqualified && !group.dnf)
  if (nextGroups.length === 0)
    return <Text style={[styles.breadText, {marginVertical: 10, textAlign: "center"}]}>Ei ryhmiä.</Text>
  return <GroupList groups={nextGroups} />
}

const LaterGroups = ({ groups, checkpointId }: { groups: Group[], checkpointId: number}) => {
  const laterGroups = groups.filter(group => checkpointId in group.route && group.nextCheckpointId !== checkpointId && !group.disqualified && !group.dnf)
  if (laterGroups.length === 0)
    return <Text style={[styles.breadText, {marginVertical: 10, textAlign: "center"}]}>Ei ryhmiä.</Text>
  return <GroupList groups={laterGroups} />
}

const WrongGroups = ({ groups, checkpointId }: { groups: Group[], checkpointId: number}) => {
  const wrongGroups = groups.filter(group => !(checkpointId in group.route))
  if (wrongGroups.length === 0)
    return <Text style={[styles.breadText, {marginVertical: 10, textAlign: "center"}]}>Ei ryhmiä.</Text>
  return <GroupList groups={wrongGroups} />
}

const ArrivingGroups = ({ checkpointId = 1 }) => {
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
        ?
        <View>
          {filteredGroups.length === 0 && <Text style={[styles.breadText, {textAlign: "center"}]}>Ei hakutuloksia.</Text>}
          <GroupList groups={filteredGroups} />
        </View>
        :
        <View>
          <Filter order={order} setOrder={setOrder} values={["Seuraavaksi saapuvat", "Myöhemmin saapuvat", "Ei tänne"]}/>
          { order === 0 && <NextGroups groups={groups} checkpointId={checkpointId} /> }
          { order === 1 && <LaterGroups groups={groups} checkpointId={checkpointId} /> }
          { order === 2 && <WrongGroups groups={groups} checkpointId={checkpointId} /> }
        </View>
      }
    </View>
  )

}

export default ArrivingGroups
