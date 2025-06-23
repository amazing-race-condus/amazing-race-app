import React, { useRef, useState } from "react"
import { View } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import AddEventForm from "@/components/forms/AddEventForm"
import BottomSheet from "@gorhom/bottom-sheet"
import AddNewButton from "@/components/ui/addNewButton"
import Events from "@/components/events/events"
import { Event } from "@/types"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

const EventSettings = () => {
  const [events, setEvents] = useState<Event[]>([])
  const user = useSelector((state: RootState) => state.user)

  const addBottomSheetRef = useRef<BottomSheet>(null)
  const handleAdd = () => {
    addBottomSheetRef.current?.expand()
  }
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Events events={events} setEvents={setEvents}/>
      { user.admin && (
        <>
          <AddNewButton onPress={handleAdd} />
          <AddEventForm events={events} setEvents={setEvents} bottomSheetRef={addBottomSheetRef}/>
        </>
      )}
    </View>
  )
}

export default EventSettings