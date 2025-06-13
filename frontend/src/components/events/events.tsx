import { View, Text, FlatList } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { getEventReducer } from "@/reducers/eventSlice"
import { getEvents } from "@/services/eventService"
import { setNotification } from "@/reducers/notificationSlice"
import { Event } from "@/types"
import EventItem from "./eventItem"
import { AppDispatch } from "@/store/store"
import { fetchGroups } from "@/reducers/groupSlice"
import { fetchCheckpoints } from "@/reducers/checkpointsSlice"

const Events = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    const fetchEvents = async () => {
      const getEv = await getEvents()
      setEvents(getEv)
    }

    fetchEvents()
  }, [])

  const handleEventChange = async (id : number) => {
    dispatch(getEventReducer(id))
    dispatch(fetchGroups(id))
    dispatch(fetchCheckpoints(id))
    dispatch(setNotification("Tapahtumanäkymä vaihdettu","success"))
  }

  return (
    <View style={[styles.content, { flex: 1 }]}>
      <Text style={styles.header}>Hallinnoi tapahtumia:</Text>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <EventItem item={ item } handleEventChange={handleEventChange}/>
        )}
      />
    </View>
  )
}

export default Events