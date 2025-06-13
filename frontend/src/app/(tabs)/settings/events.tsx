import React, { useRef, useState } from "react"
import { View } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import AddEventForm from "@/components/forms/AddEventForm"
import BottomSheet from "@gorhom/bottom-sheet"
import AddNewButton from "@/components/ui/addNewButton"
import Events from "@/components/events/events"
import { Event } from "@/types"

const EventSettings = () => {
  const [events, setEvents] = useState<Event[]>([])

  const addBottomSheetRef = useRef<BottomSheet>(null)
  const handleAdd = () => {
    addBottomSheetRef.current?.expand()
  }
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Events events={events} setEvents={setEvents}/>
      <AddNewButton onPress={handleAdd} />
      <AddEventForm events={events} setEvents={setEvents} bottomSheetRef={addBottomSheetRef}/>
    </View>
  )
}

export default EventSettings