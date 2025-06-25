import { View, Text, FlatList } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useDispatch, useSelector } from "react-redux"
import { getEventReducer } from "@/reducers/eventSlice"
import { setNotification } from "@/reducers/notificationSlice"
import { Event } from "@/types"
import EventItem from "./EventItem"
import { AppDispatch, RootState } from "@/store/store"
import { storageUtil } from "@/utils/storageUtil"

const Events = ({ onEditEvent }: { onEditEvent?: (event: Event) => void }) => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>()
  const events = useSelector((state: RootState) => state.allEvents)

  const handleEventChange = async (id : number) => {
    await storageUtil.setEventId(id)
    dispatch(getEventReducer(id))
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
          <EventItem item={ item } handleEventChange={handleEventChange} onEditEvent={onEditEvent}/>
        )}
      />
    </View>
  )
}

export default Events
