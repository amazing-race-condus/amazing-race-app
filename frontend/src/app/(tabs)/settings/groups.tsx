import React, { useRef, useState } from "react"
import { Pressable, View, Text, Keyboard } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/Notification"
import Groups from "@/components/Groups"
import BottomSheet, { BottomSheetBackdrop, BottomSheetView, BottomSheetTextInput } from "@gorhom/bottom-sheet"
import { addGroupReducer } from "@/reducers/groupSlice"
import { AddGroup } from "@/types"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"

const GroupSettings = () => {
  const dispatch = useDispatch<AppDispatch>()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const nextRef = useRef(null)
  const [groupname, setGroupname] = useState<string>("")
  const [groupMembers, setGroupMembers] = useState<number>(0)

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

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Notification />
      <Groups />
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
            // autoFocus
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

export default GroupSettings