import BottomSheet, { BottomSheetBackdrop, BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet"
import { Text, Pressable, Keyboard, View, Platform } from "react-native"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "expo-router"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { addCheckpointReducer } from "@/reducers/checkpointsSlice"
import { AddCheckpoint, CheckpointType } from "@/types"
import { RadioButton } from "react-native-paper"
import { styles } from "@/styles/commonStyles"

const AddNew = () => {
  const dispatch = useDispatch<AppDispatch>()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const router = useRouter()

  const [name, setName] = useState<string>("")
  const [type, setType] = useState<CheckpointType>("INTERMEDIATE")

  useEffect(() => {
    if (Platform.OS !== "web") {
      const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
        bottomSheetRef.current?.close()
      })
      return () => keyboardHideListener.remove()
    }
  }, [])

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

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.navigate("/")
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <BottomSheet
        index={0}
        enablePanDownToClose={true}
        ref={bottomSheetRef}
        onClose={handleBack}
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
            returnKeyType="next"
            onSubmitEditing={addNewCheckpoint}
            autoFocus
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

export default AddNew