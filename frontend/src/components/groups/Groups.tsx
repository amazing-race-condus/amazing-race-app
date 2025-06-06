import { View, Text } from "react-native"
import { useCallback, useState } from "react"
import { styles } from "@/styles/commonStyles"
import { useDispatch, useSelector } from "react-redux"
import { RootState, AppDispatch } from "@/store/store"
import { usePathname, useFocusEffect } from "expo-router"
import { fetchGroups } from "@/reducers/groupSlice"
import Search from "@/components/ui/Search"
import GroupList from "./GroupList"
import { Group } from "@/types"

const Groups = ({ onEditGroup }: { onEditGroup?: (group: Group) => void }) => {
  const [search, setSearch] = useState<string>("")
  const dispatch: AppDispatch = useDispatch()
  const groups = useSelector((state: RootState) => state.groups)
  const pathname = usePathname()

  const filteredGroups = groups.filter(item =>
    item.name.toLowerCase().startsWith(search.toLowerCase())
  )

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchGroups())
    }, [dispatch])
  )

  return (
    <View style={styles.container}>
      {pathname === "/" && <Text style={styles.title}>Ryhmät:</Text>}
      {pathname.startsWith("/settings") && <Text style={styles.header}>Hallinnoi ryhmiä:</Text>}

      <Search search={search} setSearch={setSearch} />
      {filteredGroups.length === 0 && <Text style={[styles.breadText, {textAlign: "center"}]}>Ei hakutuloksia.</Text>}

      <GroupList onEditGroup={onEditGroup} groups={filteredGroups} />
    </View>
  )
}

export default Groups