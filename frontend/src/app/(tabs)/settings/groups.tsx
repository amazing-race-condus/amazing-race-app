import React, { useRef } from "react"
import { View } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/Notification"
import Groups from "@/components/Groups"
import BottomSheet from "@gorhom/bottom-sheet"
import AddGroupForm from "@/components/AddGroupForm"
import AddNewButton from "@/components/addNewButton"

const GroupSettings = () => {
  const bottomSheetRef = useRef<BottomSheet>(null)

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Notification />
      <Groups />
      <AddNewButton onPress={() => bottomSheetRef.current?.expand()} />
      <AddGroupForm bottomSheetRef={bottomSheetRef} />
    </View>
  )
}

export default GroupSettings