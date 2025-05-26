import BottomSheet, { BottomSheetBackdrop, BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet"
import { Text, Pressable, Keyboard, View, Platform } from "react-native"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "expo-router"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { addGroupReducer } from "@/reducers/groupSlice"


const AddNew = () => {
  const dispatch = useDispatch<AppDispatch>()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const router = useRouter()

  const [groupname, setGroupname] = useState("")

  useEffect(() => {
    if (Platform.OS !== "web") {
      const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
        bottomSheetRef.current?.close()
      })
      return () => keyboardHideListener.remove()
    }
  }, [])

  const addNewGroup = async () => {
    if (groupname.trim()) {
      const newGroup = {
        name: groupname,
        id: "0"
      }
      console.log(newGroup)

      dispatch(addGroupReducer(newGroup, groupname))
      setGroupname("")
      Keyboard.dismiss()
      bottomSheetRef.current?.close()
    }
  }

  const handleBAck = () => {
    if (Platform.OS !== "ios") {
      // bottomSheetRef.current?.close()
      console.log("android back")
      router.navigate("/")
    } else {
      console.log("ios back")
      router.back()
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <BottomSheet
        index={0}
        enablePanDownToClose={true}
        ref={bottomSheetRef}
        onClose={handleBAck}
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
            returnKeyType="done"
            onSubmitEditing={addNewGroup}
            autoFocus
          />
          <Pressable
            onPress={addNewGroup}
            style={{
              backgroundColor: "orange",
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Add Group</Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheet>
    </View>
  )
}

export default AddNew
