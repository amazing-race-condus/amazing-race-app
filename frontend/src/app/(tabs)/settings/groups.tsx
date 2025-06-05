import React, { useRef } from "react"
import { View } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/ui/Notification"
import Groups from "@/components/groups/Groups"
import BottomSheet from "@gorhom/bottom-sheet"
import AddGroupForm from "@/components/forms/AddGroupForm"
import AddNewButton from "@/components/ui/addNewButton"

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