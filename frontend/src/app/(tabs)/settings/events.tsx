import React, { useRef, useState, useEffect } from "react"
import { View } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import AddEventForm from "@/components/forms/AddEventForm"
import BottomSheet from "@gorhom/bottom-sheet"
import AddNewButton from "@/components/ui/AddNewButton"
import Events from "@/components/events/Events"
import { Event } from "@/types"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import EditEventForm from "@/components/forms/EditEventForm"

const EventSettings = () => {
  const user = useSelector((state: RootState) => state.user)
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined)
  const editBottomSheetRef = useRef<BottomSheet>(null)
  const addBottomSheetRef = useRef<BottomSheet>(null)

  const handleAdd = () => {
    addBottomSheetRef.current?.expand()
    setSelectedEvent(undefined)
  }
  const handleEdit = (event: Event) => {
    setSelectedEvent(event)
  }

  useEffect(() => {
    if (selectedEvent && editBottomSheetRef.current) {
      editBottomSheetRef.current.expand()
    }
  }, [selectedEvent])

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Events onEditEvent={handleEdit}/>
      { user.admin && (
        <>
          <AddNewButton onPress={handleAdd} />
          <AddEventForm bottomSheetRef={addBottomSheetRef}/>
          <EditEventForm
            bottomSheetRef={editBottomSheetRef}
            event={selectedEvent}
            setSelectedEvent={setSelectedEvent}
          />
        </>
      )}
    </View>
  )
}

export default EventSettings
