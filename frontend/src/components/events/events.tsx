import { View, Text, FlatList } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { getEventReducer } from "@/reducers/eventSlice"
import { getEvents } from "@/services/eventService"
import { setNotification } from "@/reducers/notificationSlice"
import { Event } from "@/types"
import EventItem from "./eventItem"
import { AppDispatch } from "@/store/store"
import { fetchGroups } from "@/reducers/groupSlice"
import { fetchCheckpoints } from "@/reducers/checkpointsSlice"
import { storageUtil } from "@/utils/storageUtil"

const Events = ({
  events,
  setEvents
}: {
    events: Event[]
    setEvents: (event: Event[]) => void
  }) => {

  const dispatch: AppDispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const fetchEvents = async () => {
      const getEv = await getEvents()
      setEvents(getEv)
    }

    fetchEvents()
  }, [setEvents])

  const handleEventChange = async (id : number) => {
    await storageUtil.setEventId(id)
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