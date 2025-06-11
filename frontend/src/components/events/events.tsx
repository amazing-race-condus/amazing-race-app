import { View, Text, FlatList } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useEffect, useState } from "react"
import { getEvents } from "@/services/eventService"
import { Event } from "@/types"

const Events = () => {
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    const fetchEvents = async () => {
      const getEv = await getEvents()
      setEvents(getEv)
    }

    fetchEvents()
  }, [])

  return (
    <View style={[styles.content, { flex: 1 }]}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
          <Text>{item.name}</Text>
        )}
      />
    </View>
  )
}

export default Events