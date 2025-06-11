import { View, Text, FlatList } from "react-native"
import { styles } from "@/styles/commonStyles"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { RootState, AppDispatch } from "@/store/store"
import { getEvents } from "@/services/eventService"
import { usePathname } from "expo-router"
import { Event } from "@/types"
import Checkpoints from "../checkpoints/Checkpoints"

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
      <Text>Huulio</Text>
      {/* <FlatList
      /> */}
    </View>
  )
}

export default Checkpoints
