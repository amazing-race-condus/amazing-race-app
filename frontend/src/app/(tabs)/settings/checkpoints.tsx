import React, { useRef, useState } from "react"
import { Pressable, View, Text, Keyboard } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/Notification"
import Checkpoints from "@/components/Checkpoints"
import BottomSheet, { BottomSheetBackdrop, BottomSheetView, BottomSheetTextInput } from "@gorhom/bottom-sheet"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import { AddCheckpoint, CheckpointType } from "@/types"
import { addCheckpointReducer } from "@/reducers/checkpointsSlice"
import { RadioButton } from "react-native-paper"

const CheckpointSettings = () => {
  const dispatch = useDispatch<AppDispatch>()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const nextRef = useRef(null)

  const [name, setName] = useState<string>("")
  const [type, setType] = useState<CheckpointType>("INTERMEDIATE")

  const addNewCheckpoint = async () => {
    const newCheckpoint: AddCheckpoint = {
      name: name,
      type: type,
    }
    dispatch(addCheckpointReducer(newCheckpoint))
    setName("")
    Keyboard.dismiss()
    bottomSheetRef.current?.close()

  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Notification />
      <Checkpoints />
      {/* <AddNewButton/> */}
      <Pressable
        onPress={() => bottomSheetRef.current?.expand()}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "orange",
          width: 56,
          height: 56,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FontAwesome6 name="plus" size={24} color="white" />
      </Pressable>

      <BottomSheet
        index={-1}
        enablePanDownToClose={true}
        ref={bottomSheetRef}
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            opacity={0.5}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            pressBehavior="close"
          />
        )}
      >
        <BottomSheetView style={{ flex: 1, padding: 16 }}>
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
            // autoFocus
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
        </BottomSheetView>
      </BottomSheet>
    </View>
  )
}

export default CheckpointSettings

