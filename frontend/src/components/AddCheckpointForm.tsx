import React, { useState } from "react"
import { Keyboard, Platform, Pressable, Text, View } from "react-native"
import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { addCheckpointReducer } from "@/reducers/checkpointsSlice"
import { AddCheckpoint, CheckpointType } from "@/types"
import { RadioButton } from "react-native-paper"
import { styles } from "@/styles/commonStyles"
import BottomSheetModal from "./BottomSheetModal"

const AddCheckpointForm = ({ bottomSheetRef }: { bottomSheetRef: React.RefObject<BottomSheet | null> }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [name, setName] = useState<string>("")
  const [type, setType] = useState<CheckpointType>("INTERMEDIATE")

  const addNewCheckpoint = async () => {
    const newCheckpoint: AddCheckpoint = {
      name: name,
      type: type
    }
    await dispatch(addCheckpointReducer(newCheckpoint))
    setName("")
    Keyboard.dismiss()
    bottomSheetRef.current?.close()
  }

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={Platform.OS === "web" ? ["75%"] : []}  // fix for mobile web
    >
      <BottomSheetTextInput
        onChangeText={setName}
        value={name}
        placeholder="Syötä rastin nimi"
        style={{
          borderWidth: 1,
          borderColor: "silver",
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
        returnKeyType="done"
        onSubmitEditing={addNewCheckpoint}
      />
      <RadioButton.Group onValueChange={value => setType(value as CheckpointType)} value={type}>
        <View style={styles.radiobuttonGroup}>
          <View style={styles.radiobuttonItem}>
            <RadioButton value="START" />
            <Text>Lähtö</Text>
          </View>
          <View style={styles.radiobuttonItem}>
            <RadioButton value="INTERMEDIATE" />
            <Text>Välirasti</Text>
          </View>
          <View style={styles.radiobuttonItem}>
            <RadioButton value="FINISH" />
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