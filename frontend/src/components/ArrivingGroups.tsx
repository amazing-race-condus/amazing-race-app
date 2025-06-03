import { View, Text } from "react-native"
import { useCallback, useState } from "react"
import { styles } from "@/styles/commonStyles"
import { useDispatch, useSelector } from "react-redux"
import { RootState, AppDispatch } from "@/store/store"
import { useFocusEffect } from "expo-router"
import { fetchGroups } from "@/reducers/groupSlice"
import Search from "@/components/Search"
import GroupList from "./GroupList"
import { getArrivingGroups } from "@/services/groupService"
import { Group } from "@/types"

const ArrivingGroups = ({ checkpointId = 1 }) => {
  console.log("component ArrivingGroups, checkpoint", "?")

  const [search, setSearch] = useState<string>("")
  const dispatch: AppDispatch = useDispatch()
  const groups = useSelector((state: RootState) => state.groups)
  const [arrivingGroups, setArrivingGroups] = useState<Group[]>([])

  const filteredGroups = groups.filter(item =>
    item.name.toLowerCase().startsWith(search.toLowerCase())
  )

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchGroups())

      const fetchArrivingGroups = async() => {
        try {
          const newArrivingGroups = await getArrivingGroups(checkpointId)
          setArrivingGroups(newArrivingGroups)
        } catch (error) {
          console.log("A problem with fetching arriving groups:", error)
        }
      }
      fetchArrivingGroups()

    }, [dispatch, checkpointId])
  )

  return (
    <View style={styles.container}>
      <Search search={search} setSearch={setSearch} placeHolder="Hae kaikista ryhmistä..." />

      {search.length === 0
        ? <View>
          <Text style={styles.header}>Saapuvat ryhmät</Text>
          <GroupList groups={arrivingGroups} />
        </View>
        : <View>
          <Text style={styles.header}>Haetut ryhmät</Text>
          <GroupList groups={filteredGroups} />
        </View>}
    </View>
  )

}

export default ArrivingGroups
