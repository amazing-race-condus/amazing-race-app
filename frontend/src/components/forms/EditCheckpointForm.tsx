import React, { useState, useRef, useEffect } from "react"
import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/store"
import { Checkpoint, AddCheckpoint, CheckpointType } from "@/types"
import BottomSheetModal from "../ui/BottomSheetModal"
import { editCheckpoint } from "@/services/checkpointService"
import { setNotification } from "@/reducers/notificationSlice"
import { updateCheckpoint } from "@/reducers/checkpointsSlice"
import { Platform, Pressable, Text, View, StyleSheet } from "react-native"
import { RadioButton } from "react-native-paper"
import { styles } from "@/styles/commonStyles"
import { AxiosError } from "axios"
import { TextInput } from "react-native-gesture-handler"

const styles2 = StyleSheet.create({
  editableField: {
    borderWidth: 1,
    borderColor: "silver",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16
  },
})

const EditCheckpointForm = ({ bottomSheetRef, checkpoint, setSelectedCheckpoint }: { bottomSheetRef: React.RefObject<BottomSheet | null>, checkpoint?: Checkpoint, setSelectedCheckpoint: React.Dispatch<React.SetStateAction<Checkpoint | undefined>> }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [name, setName] = useState<string>("")
  const [type, setType] = useState<CheckpointType>("INTERMEDIATE")
  const [hintUrl, setHintUrl] = useState<string>("")
  const [easyHintUrl, setEasyHintUrl] = useState<string>("")

  const nextRef1 = useRef<TextInput>(null)
  const nextRef2 = useRef<TextInput>(null)

  const event = useSelector((state: RootState) => state.event)

  useEffect(() => {
    if (checkpoint) {
      setName(checkpoint.name)
      setType(checkpoint.type)
      setHintUrl(checkpoint.hint ?? "")
      setEasyHintUrl(checkpoint.easyHint ?? "")
    }
  }, [checkpoint])

  const handleEditCheckpoint = async () => {
    if (!checkpoint) return
    const modifiedCheckpoint: AddCheckpoint = {
      name: name,
      type: type,
      hint: hintUrl,
      easyHint: easyHintUrl,
      eventId: event.id
    }
    try {
      const updatedCheckpoint: Checkpoint = await editCheckpoint(checkpoint.id, modifiedCheckpoint)
      dispatch(updateCheckpoint(updatedCheckpoint))
      dispatch(setNotification("Rastin muokkaus onnistui", "success"))
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch(setNotification(
          error.response?.data.error ?? `Rastin tietoja ei voitu päivittää: ${error.message}`, "error"
        ))
      }
      setSelectedCheckpoint(undefined)
    }
    bottomSheetRef.current?.close()

  }

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={Platform.OS === "web" ? ["75%"] : []} // fix for mobile web
      onClose={() => setSelectedCheckpoint(undefined)}
    >
      <BottomSheetTextInput
        onChangeText={setName}
        value={name}
        placeholder="Syötä rastin nimi"
        placeholderTextColor={"grey"}
        style = {styles2.editableField}
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => nextRef1.current?.focus()}
      />
      {type === "START" || <View>
        <BottomSheetTextInput
          ref={nextRef1}
          onChangeText={setHintUrl}
          value={hintUrl}
          placeholder="Syötä vihjeen URL"
          placeholderTextColor={"grey"}
          style={styles2.editableField}
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => nextRef2.current?.focus()}
        />
        <BottomSheetTextInput
          ref={nextRef2}
          onChangeText={setEasyHintUrl}
          value={easyHintUrl}
          placeholder="Syötä helpotetun vihjeen URL"
          placeholderTextColor={"grey"}
          style={styles2.editableField}
          returnKeyType="done"
        />
      </View>}
      <RadioButton.Group onValueChange={value => setType(value as CheckpointType)} value={type}>
        <View style={styles.radiobuttonGroup}>
          <View style={styles.radiobuttonItem}>
            <RadioButton value="START" testID="radio-start" />
            <Text>Lähtö</Text>
          </View>
          <View style={styles.radiobuttonItem}>
            <RadioButton value="INTERMEDIATE" testID="radio-intermediate" />
            <Text>Välirasti</Text>
          </View>
          <View style={styles.radiobuttonItem}>
            <RadioButton value="FINISH" testID="radio-finish" />
            <Text>Maali</Text>
          </View>
        </View>
      </RadioButton.Group>
      <Pressable
        onPress={handleEditCheckpoint}
        style={({ pressed }) => [{
          backgroundColor: "orange",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
        }, {
          opacity: pressed ? 0.5 : 1
        }]}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Muokkaa rastia</Text>
      </Pressable>
    </BottomSheetModal>
  )
}

export default EditCheckpointForm