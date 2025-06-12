import { AppDispatch } from "@/store/store";
import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import { Keyboard, Platform, Pressable, Text } from "react-native";
import { useDispatch } from "react-redux";
import BottomSheetModal from "../ui/BottomSheetModal";
import { TextInput } from "react-native-gesture-handler";

const AddEventForm = ({ bottomSheetRef }: { bottomSheetRef: React.RefObject<BottomSheet | null> }) => {
  const dispatch = useDispatch<AppDispatch>()
  const nextRef = useRef<TextInput>(null)
  const [eventName, setEventName] = useState<string>("")
  const [eventDate, setEventDate] = useState<string>("")

  const addNewEvent = async () => {
    console.log("Hello world")
    Keyboard.dismiss()
    bottomSheetRef.current?.close()
  }

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={Platform.OS === "web" ? ["75%"] : []} // fix for mobile web
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
      <BottomSheetTextInput
        ref={nextRef}
        onChangeText={text => setEventDate(text)}
        placeholder="Syötä tapahtuman päivämäärä"
        placeholderTextColor={"grey"}
        value={eventDate}
        style={{
          borderWidth: 1,
          borderColor: "silver",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
        returnKeyType="done"
        onSubmitEditing={addNewEvent}
      />
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