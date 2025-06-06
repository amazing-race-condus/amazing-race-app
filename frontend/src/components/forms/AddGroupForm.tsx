import React, { useState, useRef } from "react"
import { Keyboard, Platform, Pressable, Text, View } from "react-native"
import { RadioButton } from "react-native-paper"
import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { addGroupReducer } from "@/reducers/groupSlice"
import { AddGroup } from "@/types"
import { styles } from "@/styles/commonStyles"
import BottomSheetModal from "../ui/BottomSheetModal"

const AddGroupForm = ({ bottomSheetRef }: { bottomSheetRef: React.RefObject<BottomSheet | null> }) => {
  const dispatch = useDispatch<AppDispatch>()
  const nextRef = useRef(null)
  const [groupname, setGroupname] = useState<string>("")
  const [groupMembers, setGroupMembers] = useState<number>(0)
  const [easy, setEasy] = useState<boolean>(false)

  const addNewGroup = async () => {
    if (groupname.trim()) {
      const newGroup: AddGroup = {
        name: groupname,
        members: groupMembers,
        easy: easy
      }

      dispatch(addGroupReducer(newGroup))
      setGroupname("")
      Keyboard.dismiss()
      bottomSheetRef.current?.close()
    }
  }

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
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
        }}
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => nextRef.current?.focus()}
      />
      <BottomSheetTextInput
        ref={nextRef}
        onChangeText={text => setGroupMembers(Number(text))}
        keyboardType="numeric"
        placeholder="Syötä jäsenten määrä"
        placeholderTextColor={"grey"}
        style={{
          borderWidth: 1,
          borderColor: "silver",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
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
        style={{
          backgroundColor: "orange",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Lisää ryhmä</Text>
      </Pressable>
    </BottomSheetModal>
  )
}

export default AddGroupForm