import BottomSheet, { BottomSheetBackdrop, BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet"
import { Text, Pressable, Keyboard, View, Platform } from "react-native"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "expo-router"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { addGroupReducer } from "@/reducers/groupSlice"
import { AddGroup } from "@/types"

const AddNew = () => {
  const dispatch = useDispatch<AppDispatch>()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const router = useRouter()
  const nextRef = useRef(null)

  const [groupname, setGroupname] = useState<string>("")
  const [groupMembers, setGroupMembers] = useState<number>(0)

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
      const newGroup: AddGroup = {
        name: groupname,
        members: groupMembers,
      }

      dispatch(addGroupReducer(newGroup))
      setGroupname("")
      Keyboard.dismiss()
      bottomSheetRef.current?.close()
    }
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
            onSubmitEditing={addNewGroup}
            autoFocus
          />
          <BottomSheetTextInput
            ref={nextRef}
            onChangeText={text => setGroupMembers(Number(text))}
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
            onSubmitEditing={addNewGroup}
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
            <Text style={{ color: "white", fontWeight: "bold" }}>Lisää ryhmä</Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheet>
    </View>
  )
}

export default AddNew
