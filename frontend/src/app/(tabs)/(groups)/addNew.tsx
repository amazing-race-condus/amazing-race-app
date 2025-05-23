import BottomSheet, { BottomSheetTextInput, BottomSheetView } from "@gorhom/bottom-sheet"
import { Text, Pressable, View } from "react-native"

import { useEffect, useRef, useState } from "react"
import { Stack, useRouter } from "expo-router"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { addGroupReducer } from "@/reducers/groupSlice"

const AddNew = () => {
  const dispatch = useDispatch<AppDispatch>()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [groupname, setGroupname] = useState("")
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      bottomSheetRef.current?.expand()
    }, 100)
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
      bottomSheetRef.current?.close()
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <BottomSheet
        index={0}
        snapPoints={["35%"]}
        enablePanDownToClose={true}
        ref={bottomSheetRef}
        keyboardBehavior="fillParent"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        onClose={() => router.navigate("/")}
      >
        <BottomSheetView style={{ flex: 1, padding: 16 }}>
          <BottomSheetTextInput
            onChangeText={setGroupname}
            value={groupname}
            placeholder="Enter group name"
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 12,
              marginBottom: 16,
            }}
          />
          <Pressable
            onPress={() => addNewGroup()}
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
