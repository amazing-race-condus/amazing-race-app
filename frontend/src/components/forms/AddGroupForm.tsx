import React, { useState, useRef } from "react"
import { Keyboard, Platform, Pressable, Text, View } from "react-native"
import { RadioButton } from "react-native-paper"
import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet"
import { useDispatch } from "react-redux"
import store, { AppDispatch } from "@/store/store"
import { addGroupReducer } from "@/reducers/groupSlice"
import { AddGroup } from "@/types"
import { styles } from "@/styles/commonStyles"
import BottomSheetModal from "../ui/BottomSheetModal"
import { TextInput } from "react-native-gesture-handler"

const AddGroupForm = ({ bottomSheetRef }: { bottomSheetRef: React.RefObject<BottomSheet | null> }) => {
  const dispatch = useDispatch<AppDispatch>()
  const nextRef = useRef<TextInput>(null)
  const [groupname, setGroupname] = useState<string>("")
  const [groupMembers, setGroupMembers] = useState<number>(0)
  const [easy, setEasy] = useState<boolean>(false)

  const handleGroupNumberChange = (input: string) => {
    if (isNaN(Number(input))) {
      return
    }
    setGroupMembers(Number(input))
  }

  const addNewGroup = async () => {
    const eventId = store.getState().event.id

    if (groupname.trim()) {
      const newGroup: AddGroup = {
        name: groupname,
        members: groupMembers,
        easy: easy,
        eventId: eventId
      }

      dispatch(addGroupReducer(newGroup))
      setGroupname("")
      setGroupMembers(0)
      setEasy(false)
      Keyboard.dismiss()
      bottomSheetRef.current?.close()
    }
  }

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      onClose={() => Keyboard.dismiss()}
      snapPoints={Platform.OS === "web" ? ["75%"] : []} // fix for mobile web
    >
      <BottomSheetTextInput
        onChangeText={setGroupname}
        value={groupname}
        placeholder="Syötä ryhmän nimi"
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
      <BottomSheetTextInput
        ref={nextRef}
        onChangeText={text => handleGroupNumberChange(text)}
        keyboardType="numeric"
        placeholder="Syötä jäsenten määrä"
        placeholderTextColor={"grey"}
        value={groupMembers === 0 ? "" : groupMembers.toString()}
        style={{
          borderWidth: 1,
          borderColor: "silver",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          fontSize: 16
        }}
        returnKeyType="done"
        onSubmitEditing={addNewGroup}
      />
      <RadioButton.Group onValueChange={value => setEasy(value === "true")} value={easy.toString()}>
        <View style={styles.radiobuttonGroup}>
          <View style={styles.radiobuttonItem}>
            <RadioButton value="true" />
            <Text>Helpotetut vihjeet</Text>
          </View>
          <View style={styles.radiobuttonItem}>
            <RadioButton value="false" />
            <Text>Tavalliset vihjeet</Text>
          </View>
        </View>
      </RadioButton.Group>
      <Pressable
        onPress={addNewGroup}
        style={({ pressed }) => [{
          backgroundColor: "orange",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
        }, {
          opacity: pressed ? 0.5 : 1
        }]}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Lisää ryhmä</Text>
      </Pressable>
    </BottomSheetModal>
  )
}

export default AddGroupForm