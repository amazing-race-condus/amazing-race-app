import React, { useRef } from "react"
import { View, Text } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/ui/Notification"
import AddEventForm from "@/components/forms/AddEventForm"
import BottomSheet from "@gorhom/bottom-sheet"
import AddNewButton from "@/components/ui/addNewButton"

const eventSettings = () => {
  const handleAdd = () => {
    addBottomSheetRef.current?.expand()
  }
  const addBottomSheetRef = useRef<BottomSheet>(null)
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Notification />
      <AddNewButton onPress={handleAdd} />
      <AddEventForm bottomSheetRef={addBottomSheetRef}/>
    </View>
  )
}

export default eventSettings