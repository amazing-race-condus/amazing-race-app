import { View, Text } from "react-native"
import { useState } from "react"
import { styles } from "@/styles/commonStyles"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { usePathname } from "expo-router"
import Search from "@/components/ui/Search"
import GroupList from "./GroupList"
import { Group } from "@/types"
import Filter from "../ui/Filter"
import { sortAlphabetically, sortByStatus, sortByTime } from "@/utils/groupUtils"

const Groups = ({ onEditGroup }: { onEditGroup?: (group: Group) => void }) => {
  const [search, setSearch] = useState<string>("")
  const [order, setOrder] = useState<number>(0)
  const groups = useSelector((state: RootState) => state.groups)
  const event = useSelector((state: RootState) => state.event)
  const pathname = usePathname()

  const filteredGroups = groups.filter(item =>
    item.name.toLowerCase().startsWith(search.toLowerCase())
  )

  if (order === 0) {
    sortAlphabetically(filteredGroups)
  } else if (order === 1) {
    sortByTime(filteredGroups, event)
  } else if (order === 2) {
    sortByStatus(filteredGroups)
  }

  return (
    <View style={styles.container}>
      {pathname === "/" && (
        <View style={{ flexDirection: "column", justifyContent: "center" }}>
          <Text style={styles.title}> Ryhmät</Text>
          <Text style={[styles.title, { fontSize: 15, marginTop: 0 }]}>{event.name} </Text>
        </View>
      )}
      {pathname.startsWith("/settings") && (
        <View style={{ flexDirection: "column", justifyContent: "center" }}>
          <Text style={styles.header}>Hallinnoi ryhmiä </Text>
          <Text style={[styles.title, { fontSize: 15, marginTop: 0 }]}>{event.name} </Text>
        </View>
      )}

      <Search search={search} setSearch={setSearch} />
      {filteredGroups.length === 0 && <Text style={[styles.breadText, {textAlign: "center"}]}>Ei hakutuloksia.</Text>}

      {pathname === "/" &&
        <Filter order={order} setOrder={setOrder} />
      }

      <GroupList onEditGroup={onEditGroup} groups={filteredGroups} />
    </View>
  )
}

export default Groups
