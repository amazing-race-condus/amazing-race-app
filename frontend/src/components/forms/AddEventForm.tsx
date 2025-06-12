import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet"
import { useRef, useState } from "react"
import { Keyboard, Platform, Pressable, Text } from "react-native"
import BottomSheetModal from "../ui/BottomSheetModal"
import { TextInput } from "react-native-gesture-handler"
import Calendar from "../ui/Calendar"
import { DateType } from "react-native-ui-datepicker"

const AddEventForm = ({ bottomSheetRef }: { bottomSheetRef: React.RefObject<BottomSheet | null> }) => {
  const nextRef = useRef<TextInput>(null)
  const [eventName, setEventName] = useState<string>("")
  const [eventDate, setEventDate] = useState<DateType>(new Date())

  const addNewEvent = async () => {
    console.log(eventDate)
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
      <Text>Valitse tapahtuman päivämäärä</Text>
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