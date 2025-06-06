import React, { useState, useRef, useEffect } from "react"
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

const EditGroupForm = ({ bottomSheetRef, group }: { bottomSheetRef: React.RefObject<BottomSheet | null>, group: Group }) => {
  const dispatch = useDispatch<AppDispatch>()
  const nextRef = useRef(null)
  const [groupname, setGroupname] = useState<string>(group.name)
  const [groupMembers, setGroupMembers] = useState<number>(group.members)
  const [easy, setEasy] = useState<boolean>(group.easy)

  useEffect(() => {
    setGroupname(group.name)
    setGroupMembers(group.members)
    setEasy(group.easy)
  }, [group])

  const handleEditGroup = async () => {
    const modifiedGroup: AddGroup = {
      name: groupname,
      members: Number(groupMembers),
      easy: easy
    }
    try {
      const updatedGroup: Group = await editGroup(group.id, modifiedGroup)
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
        onChangeText={text => setGroupMembers(Number(text))}
        value={groupMembers.toString()}
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