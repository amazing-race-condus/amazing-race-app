import React, { useRef, useState } from "react"
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
  const addBottomSheetRef = useRef<BottomSheet>(null)
  const editBottomSheetRef = useRef<BottomSheet>(null)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)

  const handleEdit = (group: Group) => {
    setSelectedGroup(group)
    editBottomSheetRef.current?.expand()
  }

  const handleAdd = () => {
    addBottomSheetRef.current?.expand()
    setSelectedGroup(null)
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Notification />
      <Groups onEditGroup={handleEdit} />
      <AddNewButton onPress={handleAdd} />
      <AddGroupForm bottomSheetRef={addBottomSheetRef} />
      {selectedGroup && (
        <EditGroupForm
          key={selectedGroup.id}
          bottomSheetRef={editBottomSheetRef}
          group={selectedGroup}
        />
      )}
    </View>
  )
}

export default GroupSettings