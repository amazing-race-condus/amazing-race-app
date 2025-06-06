import React, { useRef, useState, useEffect } from "react"
import { View } from "react-native"
import { Stack } from "expo-router"
import { styles } from "@/styles/commonStyles"
import Notification from "@/components/ui/Notification"
import Groups from "@/components/groups/Groups"
import BottomSheet from "@gorhom/bottom-sheet"
import AddGroupForm from "@/components/forms/AddGroupForm"
import AddNewButton from "@/components/ui/addNewButton"
import { Group } from "@/types"
import EditGroupForm from "@/components/forms/EditGroupForm"

const GroupSettings = () => {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [mode, setMode] = useState<"add" | "edit">("add")
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)

  const handleEdit = (group: Group) => {
    setSelectedGroup(group)
    setMode("edit")
    setTimeout(() => {
      bottomSheetRef.current?.expand()
    }, 3)
  }

  const handleAdd = () => {
    setSelectedGroup(null)
    setMode("add")
    bottomSheetRef.current?.expand()
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Notification />
      <Groups onEditGroup={handleEdit} />
      <AddNewButton onPress={handleAdd} />
      {mode === "add" && <AddGroupForm bottomSheetRef={bottomSheetRef} />}
      {mode === "edit" && selectedGroup && (
        <EditGroupForm
          key={selectedGroup.id}
          bottomSheetRef={bottomSheetRef}
          group={selectedGroup}
        />
      )}
    </View>
  )
}

export default GroupSettings