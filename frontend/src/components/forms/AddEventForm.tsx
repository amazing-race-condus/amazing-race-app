import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet"
import { useRef, useState } from "react"
import { Keyboard, Platform, Pressable, Text } from "react-native"
import BottomSheetModal from "../ui/BottomSheetModal"
import { TextInput } from "react-native-gesture-handler"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { createEvent } from "@/services/eventService"
import Calendar from "../ui/Calendar"
import { DateType } from "react-native-ui-datepicker"
import theme from "@/theme"
import { setNotification } from "@/reducers/notificationSlice"
import { AddEvent, Event } from "@/types"
import { AxiosError } from "axios"

const AddEventForm = ({
  bottomSheetRef,
  events,
  setEvents
}: {
    bottomSheetRef: React.RefObject<BottomSheet | null>
    events: Event[]
    setEvents: (event: Event[]) => void
  }) => {

  const dispatch = useDispatch<AppDispatch>()
  const nextRef = useRef<TextInput>(null)
  const [eventName, setEventName] = useState<string>("")
  const [eventDate, setEventDate] = useState<DateType>(new Date())

  const addNewEvent = async () => {
    if (eventName === "") {
      dispatch(setNotification("Ryhmällä täytyy olla nimi", "error"))
      return
    }
    try {
      const newEvent: AddEvent = {
        name: eventName,
        eventDate: new Date(String(eventDate))
      }
      const createdEvent: Event = await createEvent(newEvent)
      const newEvents: Event[] = events.concat(createdEvent)
      setEvents(newEvents)
      dispatch(setNotification("Tapahtuma luotu", "success"))
    } catch (error) {
      console.error("Failed to create event", error)
      if (error instanceof AxiosError) {
        dispatch(setNotification(
          error.response?.data.error ?? `Tapahtumaa ei voitu luoda: ${error.message}`, "error"
        ))
      }
    }
    setEventName("")
    setEventDate(new Date())
    Keyboard.dismiss()
    bottomSheetRef.current?.close()
  }

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={Platform.OS === "web" ? ["75%"] : ["60%"]} // fix for mobile web
    >
      <BottomSheetTextInput
        onChangeText={setEventName}
        value={eventName}
        placeholder="Syötä tapahtuman nimi"
        placeholderTextColor={"grey"}
        style={{
          borderWidth: 1,
          borderColor: "silver",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => nextRef.current?.focus()}
      />
      <Text style={{fontWeight:"bold", fontSize:theme.fontSizes.button, padding:6}}>Valitse tapahtuman päivämäärä</Text>
      <Calendar selected={eventDate} setSelected={setEventDate}/>
      <Pressable
        onPress={addNewEvent}
        style={{
          backgroundColor: "orange",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Lisää tapahtuma</Text>
      </Pressable>
    </BottomSheetModal>
  )
}

export default AddEventForm