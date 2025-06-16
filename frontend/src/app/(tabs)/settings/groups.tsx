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
  const addBottomSheetRef = useRef<BottomSheet>(null)
  const editBottomSheetRef = useRef<BottomSheet>(null)
  const [selectedGroup, setSelectedGroup] = useState<Group | undefined>(undefined)

  const handleEdit = (group: Group) => {
    setSelectedGroup(group)
  }

  const handleAdd = () => {
    addBottomSheetRef.current?.expand()
    setSelectedGroup(undefined)
  }

  useEffect(() => {
    if (selectedGroup && editBottomSheetRef.current) {
      editBottomSheetRef.current.expand()
    }
  }, [selectedGroup])

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Notification />
      <Groups onEditGroup={handleEdit} />
      <AddNewButton onPress={handleAdd} />
      <AddGroupForm bottomSheetRef={addBottomSheetRef} />
      <EditGroupForm
        bottomSheetRef={editBottomSheetRef}
        group={selectedGroup}
        setSelectedGroup={setSelectedGroup}
      />
    </View>
  )
}

export default GroupSettings