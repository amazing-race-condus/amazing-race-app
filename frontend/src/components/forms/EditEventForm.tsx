import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet"
import { useRef, useState, useEffect } from "react"
import { Keyboard, Platform, Pressable, Text } from "react-native"
import BottomSheetModal from "../ui/BottomSheetModal"
import { TextInput } from "react-native-gesture-handler"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { editEvent } from "@/services/eventService"
import Calendar from "../ui/Calendar"
import { DateType } from "react-native-ui-datepicker"
import theme from "@/theme"
import { setNotification } from "@/reducers/notificationSlice"
import { AddEvent, Event } from "@/types"
import { AxiosError } from "axios"
import { updateEvent } from "@/reducers/allEventsSlice"

const EditEventForm = ({ bottomSheetRef, event, setSelectedEvent }: { bottomSheetRef: React.RefObject<BottomSheet | null>, event?: Event, setSelectedEvent: React.Dispatch<React.SetStateAction<Event | undefined>> }) => {
  const dispatch = useDispatch<AppDispatch>()
  const nextRef = useRef<TextInput>(null)
  const [eventName, setEventName] = useState<string>("")
  const [eventDate, setEventDate] = useState<DateType>(new Date())

  useEffect(() => {
    if (event) {
      setEventName(event.name)
      setEventDate(event.eventDate ? new Date(event.eventDate) : new Date())
    }
  }, [event])

  const handleEditEvent = async () => {
    if (!event) return
    const modifiedEvent: AddEvent = {
      name: eventName,
      eventDate: new Date(String(eventDate))
    }
    try {
      const updatedEvent = await editEvent(event.id, modifiedEvent)
      dispatch(updateEvent(updatedEvent))
      dispatch(setNotification("Tapahtuman muokkaus onnistui", "success"))
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch(setNotification(
          error.response?.data.error ?? `Tapahtuman tietoja ei voitu päivittää: ${error.message}`, "error"
        ))
      }
      setSelectedEvent(undefined)
    }
    setEventName("")
    setEventDate(new Date())
    Keyboard.dismiss()
    bottomSheetRef.current?.close()
    bottomSheetRef.current?.close()

  }

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={Platform.OS === "web" ? ["75%"] : ["60%"]} // fix for mobile web
      onClose={() => setSelectedEvent(undefined)}
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
          fontSize: 16
        }}
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => nextRef.current?.focus()}
      />
      <Text style={{fontWeight:"bold", fontSize:theme.fontSizes.button, padding:6}}>Valitse tapahtuman päivämäärä</Text>
      <Calendar selected={eventDate} setSelected={setEventDate}/>
      <Pressable
        onPress={handleEditEvent}
        style={({ pressed }) => [{
          backgroundColor: "orange",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
        }, {
          opacity: pressed ? 0.5 : 1
        }]}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Muokkaa tapahtumaa</Text>
      </Pressable>
    </BottomSheetModal>
  )
}

export default EditEventForm