import { View, Text, FlatList } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { getEventReducer } from "@/reducers/eventSlice"
import { getEvents } from "@/services/eventService"
import { setNotification } from "@/reducers/notificationSlice"
import { Event } from "@/types"
import EventItem from "./EventItem"
import { AppDispatch } from "@/store/store"
import { fetchGroups } from "@/reducers/groupSlice"
import { fetchCheckpoints } from "@/reducers/checkpointsSlice"
import { storageUtil } from "@/utils/storageUtil"

const Events = ({
  events,
  setEvents,
  onEditEvent
}: {
    events: Event[]
    setEvents: (event: Event[]) => void
    onEditEvent?: (event: Event) => void
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

  const sortedEvents = [...events]
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())

  return (
    <View style={[styles.content, { flex: 1 }]}>
      <Text style={styles.header}>Hallinnoi tapahtumia:</Text>

      <FlatList
        data={sortedEvents}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <EventItem item={ item } setEvents={setEvents} events={events} handleEventChange={handleEventChange} onEditEvent={onEditEvent}/>
        )}
      />
    </View>
  )
}

export default Events