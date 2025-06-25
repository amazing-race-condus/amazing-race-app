import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet"
import { useRef, useState } from "react"
import { Keyboard, Platform, Pressable, Text } from "react-native"
import BottomSheetModal from "../ui/BottomSheetModal"
import { TextInput } from "react-native-gesture-handler"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import Calendar from "../ui/Calendar"
import { DateType } from "react-native-ui-datepicker"
import theme from "@/theme"
import { setNotification } from "@/reducers/notificationSlice"
import { AddEvent } from "@/types"
import { addEventReducer } from "@/reducers/allEventsSlice"

const AddEventForm = ({ bottomSheetRef }: { bottomSheetRef: React.RefObject<BottomSheet | null> }) => {
  const dispatch = useDispatch<AppDispatch>()
  const nextRef = useRef<TextInput>(null)
  const [eventName, setEventName] = useState<string>("")
  const [eventDate, setEventDate] = useState<DateType>(new Date())

  const addNewEvent = async () => {
    if (eventName === "") {
      dispatch(setNotification("Ryhmällä täytyy olla nimi", "error"))
      return
    }
    const newEvent: AddEvent = {
      name: eventName,
      eventDate: new Date(String(eventDate))
    }

    dispatch(addEventReducer(newEvent))
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
        style={({ pressed }) => [{
          backgroundColor: "orange",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
        }, {
          opacity: pressed ? 0.5 : 1
        }]}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Lisää tapahtuma</Text>
      </Pressable>
    </BottomSheetModal>
  )
}

export default AddEventForm