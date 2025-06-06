import React, { useState, useRef } from "react"
import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { Group, AddGroup } from "@/types"
import BottomSheetModal from "../ui/BottomSheetModal"
import { editGroup } from "@/services/groupService"
import { setNotification } from "@/reducers/notificationSlice"
import { updateGroup } from "@/reducers/groupSlice"
import { Platform, Pressable, Text, View } from "react-native"
import { RadioButton } from "react-native-paper"
import { styles } from "@/styles/commonStyles"
import { AxiosError } from "axios"

const EditGroupForm = ({ bottomSheetRef, name, members, id, level }: { bottomSheetRef: React.RefObject<BottomSheet | null>, name: string, members: string, id: number, level: boolean }) => {
  const dispatch = useDispatch<AppDispatch>()
  const nextRef = useRef(null)
  const [groupname, setGroupname] = useState<string>(name)
  const [groupMembers, setGroupMembers] = useState<string>(members)
  const [easy, setEasy] = useState<boolean>(level)

  const handleEditGroup = async () => {
    const modifiedGroup: AddGroup = {
      name: groupname,
      members: Number(groupMembers),
      easy: easy
    }
    try {
      const updatedGroup: Group = await editGroup(id, modifiedGroup)
      dispatch(updateGroup(updatedGroup))
      dispatch(setNotification("Ryhmän muokkaus onnistui", "success"))
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch(setNotification(
          error.response?.data.error ?? `Ryhmän tietoja ei voitu päivittää: ${error.message}`, "error"
        ))
      }
    }
    bottomSheetRef.current?.close()

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
        onChangeText={text => setGroupMembers(text)}
        value={groupMembers}
        keyboardType="numeric"
        placeholder="Syötä jäsenten määrä"
        style={{
          borderWidth: 1,
          borderColor: "silver",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
        returnKeyType="done"
        onSubmitEditing={handleEditGroup}
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
        onPress={handleEditGroup}
        style={{
          backgroundColor: "orange",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Muokkaa ryhmää</Text>
      </Pressable>
    </BottomSheetModal>
  )
}

export default EditGroupForm