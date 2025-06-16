import React, { useRef, useState } from "react"
import { Keyboard, Platform, Pressable, Text, View, StyleSheet } from "react-native"
import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { addCheckpointReducer } from "@/reducers/checkpointsSlice"
import { AddCheckpoint, CheckpointType } from "@/types"
import { RadioButton } from "react-native-paper"
import { styles } from "@/styles/commonStyles"
import BottomSheetModal from "../ui/BottomSheetModal"
import { TextInput } from "react-native-gesture-handler"

const styles2 = StyleSheet.create({
  editableField: {
    borderWidth: 1,
    borderColor: "silver",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
})

const AddCheckpointForm = ({ bottomSheetRef }: { bottomSheetRef: React.RefObject<BottomSheet | null> }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [name, setName] = useState<string>("")
  const [type, setType] = useState<CheckpointType>("INTERMEDIATE")
  const [hintUrl, setHintUrl] = useState<string>("")
  const [easyHintUrl, setEasyHintUrl] = useState<string>("")

  const nextRef1 = useRef<TextInput>(null)
  const nextRef2 = useRef<TextInput>(null)

  const addNewCheckpoint = async () => {
    const newCheckpoint: AddCheckpoint = {
      name: name,
      type: type,
      hint: hintUrl,
      easyHint: easyHintUrl
    }
    await dispatch(addCheckpointReducer(newCheckpoint))
    setName("")
    setType("INTERMEDIATE")
    setHintUrl("")
    setEasyHintUrl("")
    Keyboard.dismiss()
    bottomSheetRef.current?.close()
  }

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      onClose={() => Keyboard.dismiss()}
      snapPoints={Platform.OS === "web" ? ["75%"] : []}  // fix for mobile web
    >
      <BottomSheetTextInput
        onChangeText={setName}
        value={name}
        placeholder="Syötä rastin nimi"
        placeholderTextColor={"grey"}
        style = {styles2.editableField}
        onSubmitEditing={() => nextRef1.current?.focus()}
        submitBehavior="submit"
        returnKeyType="next"
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
            <RadioButton value="INTERMEDIATE" />
            <Text>Välirasti</Text>
          </View>
          <View style={styles.radiobuttonItem}>
            <RadioButton value="FINISH" testID="radio-finish" />
            <Text>Maali</Text>
          </View>
        </View>
      </RadioButton.Group>
      <Pressable
        onPress={addNewCheckpoint}
        style={{
          backgroundColor: "orange",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 16,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Lisää rasti</Text>
      </Pressable>
    </BottomSheetModal>
  )
}

export default AddCheckpointForm
